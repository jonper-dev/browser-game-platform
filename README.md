[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Ob4sIZtw)
# IDG2100-2025-oblig1

This document contains the description and starter code for `oblig1: IDG2100 Spring 2025`.

You are free to modify the starter code to customise the layout and create a theme more suitable for you. Make sure all the functionalities are included in the new layout.

# Goal

* Prove your understanding about `Web components` and how to use them.
* Demostrate you can create and build resuable `Web components` that can be used in any project or static webpage. 
* Show that you can pass data to a `Web components` from an ancestor and understand when to use `HTML attributes` or `properties` 
* Show you can pass data from a `Web component` to an ancestor using `Custom events`
* Demostrate you can provide CSS style encapsulation with your components
* Prove you can expose a way to customise or theme the Web component via CSS Custom Properties

The project is evaluated based on the previous goals. Therefore, you must show you understand all the previous concepts to get a passing grade. You may want to add a `readme` file to clarify any decision taking during the design/implementation process.

# Context

In this "oblig" you will be presented with a description of the problem you have to solve using Web component(s). 

This is an **individual task**, and you are required to build the component(s) from the ground up. Although, you may utilise snippets of code from tutorials or official documentation, you must clearly acknowledge the sources in the comments of your code. Plagiarism or cheating will be deemed to have taken place if the submitted code shows substantial similarities to other students' assignments or projects found online. In such cases, the matter will be reported to the NTNU appeals committee for further examination. If you have any doubts regarding the use of materials for your project, please reach out to the instructor for clarification. 

If the assignment is graded as "not approved" you will have an additional opportunity based on the following conditions:

1. The first version of the project must have been delivered within the set deadline (never after);
1. The project must consist on a significant piece of work (i.e.: do not deliver an empty assignment);
1. The second version of the project will have to include an additional task (as described later - See [Optional task](#Optional%20task)).

---

# Brief: Fast Horse Race - A Web Components-Based Game

The **Fast Horse Race** is a multiplayer game where players compete by rapidly pressing their assigned keys to race their horses to the finish line. Designed as a fun and engaging challenge, this game encourages quick reflexes and competitive spirit.  

Fast Horse Race is built entirely with Web Components. Each player controls a horse using a unique keyboard key, and the first to reach the goal wins the race. The game resets after each round, allowing players to compete again and again.  

Fast Horse Race is currently in development, and the following sections describe its current implementation and planned improvements.

## **Gameplay**  
1. **Race Countdown:** The game begins with a countdown timer that shows the remaining seconds before the race starts. Horses remain stationary during this time.  
2. **Start Running:** Once the timer reaches zero (never before), players can press their assigned keys to move their horses forward. The faster they press, the faster their horse moves.  
3. **Winning the Race:** The first horse to reach the finish line wins. When a horse crosses the line, the game ends immediately, and the winner is announced. Then, the game ends, the winner's horse information is displayed and share with other HTML elements and Web components so that they know the game ended. Players can then restart the game with the reset button.


# **Task: Building the Game Using Web Components**  

Your task is to develop **Fast Horse Race** using Web Components. The game should include (at least, but not limited to):  

- A `<countdown-timer>` component that manages the race start.  
- A `<race-track>` component that listens for horse movements and announces the winner.  
- Multiple `<race-horse>` components that respond to key presses.  

To complete this task successfully you will have to:
- Implement event-based communication between components.  
- Ensure smooth and responsive movement for the horses.  
- Display a clear start countdown and winner announcement.  
- Allow game restart after each round.  

The following section contains a more detailed description of the components and their behaviour.

---

# **Game Components**  

## **Countdown Timer (`<countdown-timer>`)**  
Controls when the race can start. It serves as a **"Ready... Go!"** timer but does **not** control the race duration.  

### **Attributes:**  
- `seconds`: The number of seconds before the race starts.  

### **Functionality:**  
- Counts down from `seconds` to `0`.  
- When it reaches `0`, the race begins.  

### **Controls:**  
- `start`: Begins the countdown.  
- `reset`: Resets the countdown (horses return to the start position).  

### **Events:**  
- `race-start`: Emitted when the countdown reaches `0`, signaling that the race can begin.  
- `race-reset`: Emitted when the countdown is reset, instructing all horses to return to the start line and wait for the next race.  

## **Race Track (`<race-track>`)**  
Manages the race logic and listens to horse movements.  

### **Functionality:**  
- Waits for the **`race-start`** event before allowing horses to move.  
- Tracks each horse’s progress and detects when the first horse crosses the finish line.  
- Announces the winner and stops the race.  

### **Slot Support:**  
- `<race-horse>` components can be **slotted inside `<race-track>` as children**, allowing flexible horse management within the track.  

### **Events:**  
- `race-finished`: Emitted when a horse wins, with the payload containing the name of the winner's horse and any additional information needed.  

## **Race Horse (`<race-horse>`)**  
Represents a racing horse and moves based on key presses.  

### **Attributes:**  
- `horsename`: The name of the horse.  
- `key`: The assigned key to move the horse.  
- (*) consider adding additional attributes to control control exactly how the horse will be displayed giving the user absolute control of how the horse will look like (e.g.: 🏇 vs 😪 )

### **Functionality:**  
- Waits for the **`race-start`** event before responding to key presses.  
- Moves forward (a predefined fixed amount of pixels) when the assigned key is pressed.  
- Stops moving when the race finishes.  
- Move to the start line according to the gameplay described in previous sections.
- Displays:  
  - **A horse emoji (🏇)** or a similar visual representation.  
  - **The horse’s name** for easy identification.
  - **The assigned key**, so players know which key to press to move their horse.  

Make sure the horse display is visually appealing and well-designed. Also, notice the horse must somehow be able to inform other components that it has moved and its exact position every time it does it (the `<race-track>` component will need this information to handle the game logic).

# Optional task

**Implement this task if your assignment is graded as "Not approved" and you are entitled to deliver a second iteration (See [Context](#context))**

For the optional task, you will create a **Race History Tracker** that logs the winners of past races using `localStorage`.  

## **Requirements**  

1. **New Component: `<race-history>`**  
   - This component will listen for the `race-finished` event and store race results in `localStorage`.  
   - Each result will contain:  
     - A **timestamp** of when the race finished.  
     - The **winning horse's name**.  

2. **Persisting Data in `localStorage`**  
   - When a race finishes, store the winner’s details in `localStorage` ([check online documentation](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)).  
   - Use the `Storage.setItem()` method to save results.  

   Example:  
   ```js
   let raceResults = JSON.parse(localStorage.getItem('RACE_HISTORY')) || [];
   raceResults.push({ timestamp: Date.now(), winner: 'Horse Name' });
   localStorage.setItem('RACE_HISTORY', JSON.stringify(raceResults));
   ```

   Other steps will be required to complete this task successfully.

3. **Displaying Race History**  
   - The `<race-history>` component will read from `localStorage` and display previous race winners.  
   - When the page refreshes, the history should persist.  

4. **Updating the Component**  
   - Every time a new race ends, update the displayed history without requiring a page reload.  

To test this new functionality you can follow these steps:

1. Start the game and complete a few races.  
1. Check if each winner is recorded in the history section (in the user interface).  
1. Refresh the page and verify that past race results remain visible in the user interface.  

# Delivery

This compulsory assignment consists of two parts: **code submission** and an **individual on-campus oral presentation**. Both parts must be completed to receive a passing grade.  

## Code Submission

Deadline can be found in Blackboard. 

This assignment must be delivered in two different places: GitHub classroom and Blackboard.

- To deliver the assignment in GitHub Classroom, you only need to make sure all your changes and commits are pushed to your Git repository.

- It is imperative that you work exclusively with this Git repository to ensure that all modifications are trackable and your code is backed up on a regular basis. Hence, you should commit your progress directly to this repository each time you make advancements.

- Before delivering the assignment in Blackbard, make sure your project has all the files it needs. Delete any file or info not needed (this is `.git/` folder, etc.). Zip the project and upload the file to Blackboard. 

## Oral presentation

Details regarding the oral presentation will be provided on **Blackboard**.  

# DOCUMENTATION

Use this section to document your component.