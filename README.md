# Exercising webapp with pose detection

This was my final project for cs50's Introduction to computer science course. [Demonstration Video](https://youtu.be/EKAhq4ediJg).

## Description

This project uses javascript (+ mediapipe library) to make a webapp in which the user needs to do some exercises and at the end it will give score on how ***good*** the user has done the exercise. This is a static website which uses your webcam to detect your position and calculates angles based on x, y, and z values of 33 landmarks on your body. 

The way the flow of exercise is thorugh `exer_ob` array. In each element you need to describe the exercise's **name**, **GIF**, and **reps**. In general there can be two types of exercises: *time-based* and *reps-based*. The detection and scoring is different. But in both of them the score is between 0 to 100; the best and worst possible mean of angles is defined in function and by simple math the score is calculated. 

In each frame after getting the results from mediapipe, the `onResults` function will be called, if there were no results (i.e. user is not detected), canvas will be hidden and "*I can't see you*" will be shown. If there were results, it will wait until the user is **ready** meaning they have brought their arm, 45 degrees up for 10 seconds. Then `started_exercise` will be `true`. But also for each exercise there will be a countdown and then, that exercise will be `initiated`, canvas will be shown with all `exercise_ui`s. There is a function called in each frame that checks wether the exercise in `finished`, if so, the `active_excercise` object will be updated. 

### **Time-based** exercises
  + The progress bar is filled according to time
  + The color of progress bar is changed depending on how *good* you are doing the exercise
  + JumpingJacks
    + The mean angles of `beyn_dast` (between hands) and `beyn_pa` (between legs) is calculated in each frame.
    + A history of last 6 frames of data is stored and the mean difference of these angles is used to calculated the score
    + The more dfference between 6 frames, the more they have moved :D

### **Reps-based** exercises
  + The progress bar is filled in each reps depending on how good you were
  + Each exercise can be in two possible states which is stored in `active_excercise['waswhere']`
  + Only if the state *changes* the reps will go higher and the score is calculated.
  + If the state doesn't change but the angle in question is getting better (for example we have detected the person sitting but they are still going down and their potential score is getting better), the new score is stored.
  + Squats
    + The mean angles of right leg, left leg, right knee, and left knee is calculated. 
  + ForwardBend
    + The mean angles of right leg, and left leg is calculated.


## How to use

I downloaded the files needed to do pose detection and stored them locally, and accessing local files from javascript is not possible; therefore you should use `http-server` command in this directory and open `/mediapipe.html` from there. 

## Libraries used

The detections are done using mediapipe solutions. The code sample used is located at [Medaipie Website](https://google.github.io/mediapipe/getting_started/javascript.html).


## Folders and Files

The html, css, and javascript used to make the workout app. 

```
.
├── css
│   ├── styles.scss             >>> Sass file that compiles to css for styling 🌄
│   └── ...
│
├── js
│   ├── mp.js                   >>> JS file that handles pose, ui, etc. (in each frame) ⚙️
│   └── ...                     >>> Other files for handling camera and canvas [*from mediapipe*]
│
├── gifs                        >>> GIFs, used to demonstrate the exercise
│   └── ...
│
├── pose                        >>> Files used by mediapipe [*from mediapipe*]
│   └── ...
│
└── medaipipe.html              >>> HTML file (that needs to be opened) 🐸
```