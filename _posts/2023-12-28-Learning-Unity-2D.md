---
title: Learning Unity 2D
date: 2023-12-28 10:10:10 +0800
categories: [Game Development, 2D]
tags: [unity, 2d]
math: true
mermaid: true
img_path: /assets/images/unity-2d-1
---

<script>{% include_relative assets/scripts/ga-pv.js %}</script>

I am starting 2D Game Development journey in Unity, here is a summary for future me of what I learnt. Scroll till the end to see the results.

## Fundamentals:
We have GameObjects that are the fundamental object in unity. These GameObjects have Components like `Transform` and other Component like `RigidBody` can be added to the GameObject.

## Scripts
Scripts are another component in the unity. You can add them on the objects and it can controll the behaviour of the interactions. To controll the behaviour of the object you can use scripts, like to get the component:

```csharp
var component = this.GetComponent<T>(); // T is the type of the component
```

## Scene and Camera
The Scene is the super parent of everything. Main camera is the entity sees what we see. You can adjust your camera position from the unity editor or you can use scripts to position the camera.

## Layers
Since we are making 2D games, to control the layer of sprite rendering we should use layers, the higher numbered layered is rendered on top of a lower numbered layer. 

## Assets
The assets folder should ideally contain all the assets of the game like sprites, music etc. Sprites are the images which are rendered in Unity, it can have animations and stuff.

## Collisions and Triggers
Collison detection in unity happens with the help of colliders, you need to add colliders in the game object. When ever there is a collision between two colliders in the game, and event it emitted. There are many kinds of collisions but we primarily use the following two

```csharp
OnCollisionEnter2(Collision2D other) {}
OnCollisonExit2D(Collision2D other) {}

// Triggers
OnTriggerExit2D(Collider2D other) {}
OnTriggerEnter2D(Collider2D other) {}
```

Sometimes you dont want to have collision but just detect a collison, in such cases you can make the collidor as trigger. Triggers help in detecting the collisions.

## Tags

You can create tags like player, ground, tree, house etc and assing the tags to the game object, which you can later use in scripts to define consistent logic.

```csharp
void OnTriggerEnter2D(Collider2D other)
{
    if (other.tag == "Boost")
    {
        Debug.Log("package entered the trigger");
        currSpeed = boostSpeed;
    }
}
```

## Inputs
Inputs in unity is taken care by the input class

```csharp
UnityEngine.Input

Input.GetAxis("Horizonatal");
Input.GetAxis("Vertical");
```

The GetAxis method is used to get the value in that axis, the above code makes it input method agnostic, like keyboard, joystick, mouse etc.

## Time.deltaTime

The unity engine runs in a loop. In each loop the Update is called. Usually what ever updates you can to perform on the GameObject you do it in the Update method.

```csharp
void Update()
{
    this.speed += Input.GetAxis("Vertical") * currSpeed;
}

```

But this is not frame independant. For faster machines the Update will be called more frequently per frame than for slower machines. To make it framework independant, we should use Time.deltaTime, it gives the amount of time passed since last timeframe.

```csharp
void Update()
{
    this.speed += Input.GetAxis("Vertical") * currSpeed * Time.deltaTime;
}

```

# Destroying Object

To destroy the objects you can call the Destroy method, with a delay:

```csharp
void OnTriggerEnter2D(Collider2D other)
{
    if (other.tag == "Package")
    {
        Debug.Log("car collided with the package the trigger");
        Destroy(other.gameObject, 0.1f);

    }
}

```

## Creating The Game
Now that we have all the things together, let me jot down the steps to create a very basic game of delivery system of cars:

1. Create a 2D game.
2. Import the assets, create the layouts of road, trees, houses, rocks etc.
3. Add a collider on the assets which will stop the car likes, house, rocks, tree.
4. Import your can and add a rigid body and colliders.
5. Create packages and put the colliders to trigger on them.
6. Add scripts that controls car movement, attaches the camera to the car and scoring system
7. Enjoy your game!

![Car](car.gif)