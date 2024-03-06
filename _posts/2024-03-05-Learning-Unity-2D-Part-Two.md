---
title: Learning Unity 2D Part Two
date: 2024-03-04 10:10:10 +0800
categories: [Game Development, 2D]
tags: [unity, 2d]
math: true
mermaid: true
---

<script>{% include_relative assets/scripts/ga-pv.js %}</script>

Taking one step further into the 2D Game Development journey I will summarize what I learnt while creating a custom snow boarding game:

## Cinemachine

Tired of writing scripts to follow the main character? Use Cinemachine! Very easy open source package created to give the developer power over how the camera works.

## Edge Collidors

Edge Colliders are custom colliders for the 2d game objects in unity. There are some inbuit triggers provided by unity like:

```csharp
void OnCollisionEnter2D() {}
void OnCollisionExit2D() {}
```

Collisions are enabled by colliders no need rigid body.

> Is your collision detection not happening properly ? Do you think sometimes it works and some times it doesn't, maybe you have set the collision detection to discrete instead of continous, unity does it to save computation.
{: .prompt-tip }

## Character Modelling

Usually when creating the character it's good to create separate components for body and head and stuff like that. You can add separate colliders on each and make your code more modular code. Try experimenting the different shapes of the colliders.

> When creating games in 2D its usually good to check the Z-values, a lot of time the Z values give issues with the redering of the object.
{: .prompt-tip }

## Surface Effectors

Its a component to add force along the edge/surface of the colliders. Its analogous to the conveyor belt. Play around to find out.


## Rigid Body and Torque

If you add Rigid Body to a Game Object then you can play around with the Torque. To learn more about Torque, study physics.

```csharp
    GetComponent<RigidBody2d>().AddTorque(torque);
```

> Its good to have the position and rotation of the child component's set to zero, relative to the parent. To avoid future issues with rotation and translation of child components.
{: .prompt-tip }

## Sprites and Sprite Shapes:

Sprite are the images in the Unity. If you want to create custom shapes, you can use sprite shapes. Also dont forget to layer the sprites using ```Order in Layer``` in the unity inspector. It will help you create render the sprites on top of each other.

> One tip to increase and decrease the size of the pizel art is to change the value of Pixel Per Unit for the Sprite
{: .prompt-tip }

## Loading Scenes

The ```SceneManager``` is used to Load Scenes in Unity, its part of the ```UnityEngine.SceneManagement``` namespace. You can use the name of the scene to load the scene of its index in the build.

```csharp
    SceneManager.LoadScene(0);
```
Find the build index by
```yaml
File
    - Build Settings
        - Scenes in Build
```


## Invoke Methods With Delay

Sometimes you want to call a method after waiting for some period of time. In such cases, call the method using the Invoke:
```csharp
    float delay = 1f; // in seconds
    Invoke(nameof(MethodToCall), delay)
```

## ParticleSystem

Particle System are cool and cannot be summarized in one paragraph. Play around with it :)

> Use Gizmos to control what you see in the scene and game scene
{: .prompt-tip }

## Using the FindObjectType

Unity provides the ```FindObjectType()``` method in case you can access a method using its type. If its one of a kind you can get it, else unity will get the first one. Usally comes in handy when you have custom script classes which are used at only one places or singletons. Use it to call public methods on other classes, example

```csharp
    FindObjectOfType<PlayerController>().StopMoving();
```

## Public Modifiers and Serialize Fields

if you want to expose a field in the Unity Inspector you can either mark the field as ```[SerializeField]``` or you can make it public. Both of these will help you access the field in the inspector. However one down sight of making the field public is that you can accidentally change the fields from other classes :)

## Triggring Sound Effects:

Sound effects in unity are created using ```AudioSource```. The main camera has the ```AudioListner`` which listens to the audio source. In a game object if you have the AudioSource you can get that component using 
```csharp
    GetComponent<AudioSource>();
```

Attach an AudioClip ```AudioClip``` in the  ```AudioSource``` component and enjoy. Or you can get the audio source component and assign the audio clip manually using the ```[SerializeField]``` attribute.

```csharp
    GetComponent<AudioSource>().PlayOneShot(audioClip);
```

