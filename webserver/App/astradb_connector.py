import os
import json
import logging
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
import pandas as pd

@dataclass
class DatabaseConfig:
    host: str
    port: int
    username: str
    password: str
    database: str = ""
    keyspace: str = ""

class AstraDBConnector:
    def __init__(self, secure_connect_bundle_path: str, client_id: str, client_secret: str, keyspace: str):
        self.secure_connect_bundle_path = secure_connect_bundle_path
        self.client_id = client_id
        self.client_secret = client_secret
        self.keyspace = keyspace
        self.session = None
        self.cluster = None
        
    def connect(self):
        try:
            auth_provider = PlainTextAuthProvider(self.client_id, self.client_secret)
            self.cluster = Cluster(
                cloud={'secure_connect_bundle': self.secure_connect_bundle_path},
                auth_provider=auth_provider
            )
            self.session = self.cluster.connect(self.keyspace)
            logging.info("Successfully connected to AstraDB")
            return True
        except Exception as e:
            logging.error(f"Failed to connect to AstraDB: {e}")
            return False
    
    def disconnect(self):
        if self.session:
            self.session.shutdown()
        if self.cluster:
            self.cluster.shutdown()
        logging.info("Disconnected from AstraDB")
    
    def execute_query(self, query: str, parameters: tuple = None) -> List[Dict]:
        try:
            if parameters:
                result = self.session.execute(query, parameters)
            else:
                result = self.session.execute(query)
            
            rows = []
            for row in result:
                rows.append(dict(row._asdict()))
            return rows
        except Exception as e:
            logging.error(f"Query execution failed: {e}")
            return []
    
    def get_table_data(self, table_name: str, limit: int = 1000) -> pd.DataFrame:
        query = f"SELECT * FROM {table_name} LIMIT {limit}"
        data = self.execute_query(query)
        return pd.DataFrame(data)

class PostgreSQLConnector:
    def __init__(self, config: DatabaseConfig):
        self.config = config
        self.connection = None
        
    def connect(self):
        try:
            import psycopg2
            self.connection = psycopg2.connect(
                host=self.config.host,
                port=self.config.port,
                database=self.config.database,
                user=self.config.username,
                password=self.config.password
            )
            logging.info("Successfully connected to PostgreSQL")
            return True
        except Exception as e:
            logging.error(f"Failed to connect to PostgreSQL: {e}")
            return False
    
    def insert_dataframe(self, df: pd.DataFrame, table_name: str):
        try:
            from sqlalchemy import create_engine
            engine = create_engine(
                f'postgresql://{self.config.username}:{self.config.password}@{self.config.host}:{self.config.port}/{self.config.database}'
            )
            df.to_sql(table_name, engine, if_exists='append', index=False)
            logging.info(f"Data inserted into PostgreSQL table: {table_name}")
        except Exception as e:
            logging.error(f"Failed to insert data into PostgreSQL: {e}")
    
    def disconnect(self):
        if self.connection:
            self.connection.close()
        logging.info("Disconnected from PostgreSQL")

class MySQLConnector:
    def __init__(self, config: DatabaseConfig):
        self.config = config
        self.connection = None
        
    def connect(self):
        try:
            import mysql.connector
            self.connection = mysql.connector.connect(
                host=self.config.host,
                port=self.config.port,
                database=self.config.database,
                user=self.config.username,
                password=self.config.password
            )
            logging.info("Successfully connected to MySQL")
            return True
        except Exception as e:
            logging.error(f"Failed to connect to MySQL: {e}")
            return False
    
    def insert_dataframe(self, df: pd.DataFrame, table_name: str):
        try:
            from sqlalchemy import create_engine
            engine = create_engine(
                f'mysql+mysqlconnector://{self.config.username}:{self.config.password}@{self.config.host}:{self.config.port}/{self.config.database}'
            )
            df.to_sql(table_name, engine, if_exists='append', index=False)
            logging.info(f"Data inserted into MySQL table: {table_name}")
        except Exception as e:
            logging.error(f"Failed to insert data into MySQL: {e}")
    
    def disconnect(self):
        if self.connection:
            self.connection.close()
        logging.info("Disconnected from MySQL")

class MongoDBConnector:
    def __init__(self, config: DatabaseConfig):
        self.config = config
        self.client = None
        self.database = None
        
    def connect(self):
        try:
            from pymongo import MongoClient
            connection_string = f"mongodb://{self.config.username}:{self.config.password}@{self.config.host}:{self.config.port}/{self.config.database}"
            self.client = MongoClient(connection_string)
            self.database = self.client[self.config.database]
            self.client.admin.command('ping')
            logging.info("Successfully connected to MongoDB")
            return True
        except Exception as e:
            logging.error(f"Failed to connect to MongoDB: {e}")
            return False
    
    def insert_dataframe(self, df: pd.DataFrame, collection_name: str):
        try:
            collection = self.database[collection_name]
            records = df.to_dict('records')
            collection.insert_many(records)
            logging.info(f"Data inserted into MongoDB collection: {collection_name}")
        except Exception as e:
            logging.error(f"Failed to insert data into MongoDB: {e}")
    
    def disconnect(self):
        if self.client:
            self.client.close()
        logging.info("Disconnected from MongoDB")

class DatabaseMigrator:
    def __init__(self, astra_connector: AstraDBConnector):
        self.astra_connector = astra_connector
        
    def migrate_to_postgresql(self, pg_config: DatabaseConfig, table_mappings: Dict[str, str]):
        pg_connector = PostgreSQLConnector(pg_config)
        
        if not pg_connector.connect():
            return False
            
        try:
            for astra_table, pg_table in table_mappings.items():
                logging.info(f"Migrating {astra_table} to {pg_table}")
                df = self.astra_connector.get_table_data(astra_table)
                pg_connector.insert_dataframe(df, pg_table)
            
            pg_connector.disconnect()
            return True
        except Exception as e:
            logging.error(f"Migration to PostgreSQL failed: {e}")
            pg_connector.disconnect()
            return False
    
    def migrate_to_mysql(self, mysql_config: DatabaseConfig, table_mappings: Dict[str, str]):
        mysql_connector = MySQLConnector(mysql_config)
        
        if not mysql_connector.connect():
            return False
            
        try:
            for astra_table, mysql_table in table_mappings.items():
                logging.info(f"Migrating {astra_table} to {mysql_table}")
                df = self.astra_connector.get_table_data(astra_table)
                mysql_connector.insert_dataframe(df, mysql_table)
            
            mysql_connector.disconnect()
            return True
        except Exception as e:
            logging.error(f"Migration to MySQL failed: {e}")
            mysql_connector.disconnect()
            return False
    
    def migrate_to_mongodb(self, mongo_config: DatabaseConfig, collection_mappings: Dict[str, str]):
        mongo_connector = MongoDBConnector(mongo_config)
        
        if not mongo_connector.connect():
            return False
            
        try:
            for astra_table, mongo_collection in collection_mappings.items():
                logging.info(f"Migrating {astra_table} to {mongo_collection}")
                df = self.astra_connector.get_table_data(astra_table)
                mongo_connector.insert_dataframe(df, mongo_collection)
            
            mongo_connector.disconnect()
            return True
        except Exception as e:
            logging.error(f"Migration to MongoDB failed: {e}")
            mongo_connector.disconnect()
            return False

def main():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    
    # AstraDB Configuration
    astra_config = {
        'secure_connect_bundle_path': '/path/to/secure-connect-bundle.zip',
        'client_id': 'your_client_id',
        'client_secret': 'your_client_secret',
        'keyspace': 'your_keyspace'
    }
    
    # Initialize AstraDB connector
    astra_connector = AstraDBConnector(**astra_config)
    
    if not astra_connector.connect():
        logging.error("Failed to connect to AstraDB")
        return
    
    # Initialize migrator
    migrator = DatabaseMigrator(astra_connector)
    
    # Example: Migrate to PostgreSQL
    pg_config = DatabaseConfig(
        host='localhost',
        port=5432,
        username='postgres_user',
        password='postgres_password',
        database='target_database'
    )
    
    table_mappings = {
        'astra_table1': 'postgres_table1',
        'astra_table2': 'postgres_table2'
    }
    
    success = migrator.migrate_to_postgresql(pg_config, table_mappings)
    if success:
        logging.info("Migration to PostgreSQL completed successfully")
    else:
        logging.error("Migration to PostgreSQL failed")
    
    # Example: Migrate to MySQL
    mysql_config = DatabaseConfig(
        host='localhost',
        port=3306,
        username='mysql_user',
        password='mysql_password',
        database='target_database'
    )
    
    success = migrator.migrate_to_mysql(mysql_config, table_mappings)
    if success:
        logging.info("Migration to MySQL completed successfully")
    
    # Example: Migrate to MongoDB
    mongo_config = DatabaseConfig(
        host='localhost',
        port=27017,
        username='mongo_user',
        password='mongo_password',
        database='target_database'
    )
    
    collection_mappings = {
        'astra_table1': 'mongo_collection1',
        'astra_table2': 'mongo_collection2'
    }
    
    success = migrator.migrate_to_mongodb(mongo_config, collection_mappings)
    if success:
        logging.info("Migration to MongoDB completed successfully")
    
    astra_connector.disconnect()

if __name__ == "__main__":
    main()