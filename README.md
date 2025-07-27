# AI FG coach
This AI coach is going to watch your replay and give advices. It will tell what you could have done in specific situation, such as best combo options, meter usage and frame data. 

 For example, if you are getting hit by same move more than 3 times, the AI will tell what should've you done in that situation.

 # How to approach this projet
 ・Start from learning about AI from MIT Deep Learning AI lectures. 
 
 ・Build proto type to prove that my theory is possible. 


 # Sections
 1: download videos from Youtube

 2: pretrained AI will learn from the video frame by frame.

HP bar- AI needs to know which player has an advantage over HP. Also needs to recognize what combo kills the opponent

Frame data- AI needs to recognize what moves are punishable, plus and negative on block.

Distance- AI could predict what moves could reach the opponent. 

Meter- Meter usage is one of the most important factor to win in street fighter6. AI predicts the best possible outcome for certain situations. Such as burning out the opponent's drve meter.

Damage output- Each moves do diffferent damage. This math is required for the best combo prediction. 

# Progress
 ・ Went to Amazon AWS to learn and get some ideas about my project. I had a chance to do lab about making AI that answers questions.

 ・Made my own chatGPT to deepen my understand about AI. Reference- https://youtu.be/kCc8FmEb1nY?si=3fh00REh3R-VRhPj
I still don't understand some materals, but I will cover them by taking machine learning class this semester. 

# How to Run the Application

This project uses a `Makefile` to simplify the process of building, running, and cleaning up the application.

### Prerequisites

*   [Podman](https://podman.io/getting-started/installation)

### Running the Application

1.  **Build the container images:**
    ```bash
    make build
    ```

2.  **Run the application:**
    ```bash
    make run
    ```
    This will start the `webserver` and `langflow` containers. The webserver will be available at `http://localhost:8080` and langflow at `http://localhost:7860`.

3.  **Run with a specific environment:**
    You can specify an environment (e.g., `dev`, `qa`, `prod`) by using the `env` variable. This will load the corresponding `.env` file (e.g., `.env.dev`).
    ```bash
    make run env=dev
    ```

### Cleaning Up

To stop the containers and remove the built images, run the following command:
```bash
make clean
```

This will stop and remove the containers and then remove the container images. 







