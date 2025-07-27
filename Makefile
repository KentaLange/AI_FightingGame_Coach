 # Define Image and Container Names
WEB_IMAGE_NAME = webserver-image
LANGFLOW_IMAGE_NAME = langflow-image
WEB_CONTAINER_NAME = coach
LANGFLOW_CONTAINER_NAME = langflow

# Environment variable, defaults to ""
env ?=

# Determine the .env file to use
ifneq ($(env),)
    ENV_FILE = .env.$(env)
else
    ENV_FILE = .env
endif

# Check if the .env file exists


ENV_FILE_EXISTS = $(wildcard $(ENV_FILE))

# Default target
all: build

# List available targets
list:
	@echo"Available targets:"
	@echo"  all       - Build all images"
	@echo"  build     - Build all images"
	@echo"  run       - Run all containers"
	@echo"  stop      - Stop and remove all containers"
	@echo"  clean     - Remove all built images"
	@echo"  list      - List available targets"
	@echo"  env       - Show the current environment"

# Build targets
build:
	cd webserver && podman build -t$(WEB_IMAGE_NAME) -f Containerfile .
	cd langflow && podman build -t$(LANGFLOW_IMAGE_NAME) -f Containerfile .

# Run target to start containers
test:
ifeq ($(ENV_FILE_EXISTS),)
	podman run --replace -d --name $(WEB_CONTAINER_NAME) -p 3000:3000 $(WEB_IMAGE_NAME)
	podman run --replace -d --name $(LANGFLOW_CONTAINER_NAME) -p 8080:8080 -p 7860:7860 $(LANGFLOW_IMAGE_NAME)
else
	podman run --replace -d --name $(WEB_CONTAINER_NAME) -p 3000:3000 --env-file $(ENV_FILE) $(WEB_IMAGE_NAME)
	podman run --replace -d --name $(LANGFLOW_CONTAINER_NAME) -p 7860:7860 -p 8080:8080  --env-file $(ENV_FILE) $(LANGFLOW_IMAGE_NAME)
endif

# Stop and remove containers
stop:
	podman stop $(WEB_CONTAINER_NAME) || true
	podman stop $(LANGFLOW_CONTAINER_NAME) || true

# Clean up images
clean:
	podman rmi $(WEB_IMAGE_NAME) $(LANGFLOW_IMAGE_NAME) || true

# Show the current environment
env:
	@echo"Current environment: $(env)"
	@echo"Using env file: $(ENV_FILE)"

.PHONY: all build run stop clean list env
