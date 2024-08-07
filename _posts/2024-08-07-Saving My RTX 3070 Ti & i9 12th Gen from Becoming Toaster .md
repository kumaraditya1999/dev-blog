---
title: Saving My RTX 3070 Ti & i9 12th Gen from Becoming Toaster 
date: 2024-08-07 10:10:10 +0800
categories: [Computer Hardware]
tags: [cpu, gpu, thermal throtelling]
math: true
mermaid: true
img_path: /assets/images/repasting
---

Although I have been a fan of gaming, I am not blessed with distinguishing **Really Good FPS** with **Good FPS** 

<img src="ken-jeong-what.gif" alt="GIF" />

and maybe that is the reason why the degrading state of my CPU and GPU as not very evident to me. 

## Initial Issues

It started a couple of days ago when I saw my FPS dropping significantly while playing `AC Valhalla` on charger, once I removed the charger the performance was better. So I started playing without my charger and thought it was no big deal.

<img src="bad-pc-pc-on-fire.gif" alt="bad-pc" />

Then frustrated with the **AC Valhalla** experience of charging again and again I started `Evil Within 2` which was a little older than **AC Valhalla**.

Ultra, High and Medium settings gave me similar experience ??? I thought maybe I am just overthinking. After sometime the game also started lagging. 

I used GeForce Experience to get the actual FPS in `Evil Within 2`. It was **25 FPS** on all settings. With `RTX 3070 Ti` and `i9 12th Gen` I should be getting at least `60FPS` in High settings.

<img src="gaming-timmy-turner.gif" alt="gamming timmy gif" />

Finally I did the inbuilt benchmark test in `AC Valhalla` and surprise, surprise. I was getting `30FPS` on medium settings with low resolutions and other weird optimizations .... where as people claimed to get `60FPS` on Ultra settings.

My laptop is around 1.5 years old and I had played `GoW`, `Control`, `Forza Horizon 4` all with Ray Tracing, I knew my GPU was working earlier.

## Software Drivers

After researching on Reddit and Youtube, I figured out that my laptop is hugely underperforming!

I toggled around the power settings but nothing helped, in the end I did what everyone does:

Fresh Install of Windows.

<img src="clear-delete.gif" alt="clear-delete" />

That did not help at all, but the following did:

1. BIOS update.
2. DDU for fresh install of NVidia Drivers.

The fresh install of NVidia Drivers seemed to improve the performance, I got `25 FPS` on Ultra settings which was `10 FPS` earlier. But this was still far below the average performance.

## Self Diagnosis

Now I installed a bunch of softwares to accurately measure my laptop's performance.

1. [Heaven Bench Mark](https://benchmark.unigine.com/heaven): **25 FPS**, heated my GPU to **90&deg;C** and the performance was subpar

<img style="max-width: 85%; margin: 0 auto; display: block;" src="heaven-benchmark-1.png" alt="heaven bench mark test 1" />

2. [AC Valhalla](https://store.steampowered.com/app/2208920/Assassins_Creed_Valhalla/): **15 FPS**, **CPU** and **GPU** temps skyrocketing towards **100&deg;C** within seconds of benchmark

<img style="max-width: 85%; margin: 0 auto; display: block;" src="ac-valhalla-1.png" alt="ac-valhalla-1.png" />

3. [3d Mark Ratings](https://www.3dmark.com/): I got **817**, my integrated graphics had the score of **1100**.

<img style="max-width: 85%; margin: 0 auto; display: block;" src="benchmark-1.png" alt="benchmark-1.png">

Since we already eliminated the software, it must be that my GPU is done for good. I fiddled around the internet about eliminating the hardware virus or replacing the GPU, but I stumbled across undervolting the GPUs and CPU to extend their life.

> Undervolting a CPU or GPU involves reducing the voltage supplied to these components to lower power consumption and heat generation. This process helps improve thermal efficiency, resulting in cooler and quieter operation. The primary benefits include increased energy efficiency, prolonged hardware lifespan, and often maintaining performance levels. It can be particularly beneficial for laptops, where battery life and thermal management are crucial. Overall, undervolting enhances system stability and longevity without significant performance loss.
{: .prompt-info }

While undervolting using the [MSI After Burner](https://www.msi.com/Landing/afterburner/graphics-cards) I found out that the GPU and CPU are not getting max applicable voltage, I can't undervolt. And even though the voltage is low, its at a very high temperature. So I started looking into the temperature side of the equation:

While doing nothing the **CPU** is touching **70&deg;C** which should be **40&deg;C** and **GPU** is **71&deg;C** when the utilization is **zero** ?
<img style="max-width: 85%; margin: 0 auto; display: block;" src="silent-temp.png" alt="silent-temp.png">

So, finally [people of Reddit](https://www.reddit.com/r/ZephyrusM16/comments/1ekqn0b/zephrusm16_2022_gpu_underperforming_and/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button) pointed it out to me that the issue should be with the cooling of CPU and GPU.

The last thing that gave me the confirmation was the uneven temperature of CPU cores:
<img style="max-width: 85%; margin: 0 auto; display: block;" src="core-temp.png" alt="core-temp.png">

Some **CPU cores** are throttled, the difference in temperature of **Core P1** and **P3** with rest of the cores was more than **20&deg;C**

I was pretty much convinced that the issue is with the hardware, so after countless youtube videos of laptop disassembly and upgradation I figured out my laptop needs the following:

1. Cleaning the CPU and GPU fans.
2. Respreading the Liquid Metal on CPU.
3. Replacing the Thermal Paste on GPU.

> Just to give little more context, the **CPU** and **GPU** are connected to the **Heat Sink** in laptop. The **Heat Sink** dissipates the heat generated from **CPU** and **GPU**. The binding stuff between **CPU** and **Heat Sink** is Liquid Metal, highly conductive both thermally and electrically However **GPU** requires a lesser thermally conductive material to transfer the heat, thermal paste, very safe as its **not electrically conductive**, **10 times less thermally conductive compared to liquid metal**, but it does the job.
{: .prompt-info }

> If Liquid Metals falls on any part of Mother Board it will be shorted, so application of Liquid Metal should be done with caution.
Also, if the thermal material on top of **CPU** and **GPU** gets displaced or dried out, the conduction of heat is obstructed, indirectly increasing the heat of the components absurdly.
{: .prompt-danger }

## Disassembling My Rig

Although I didn't do it myself and got a repair person to open up my laptop, I was overseeing the entire process and all my three hunches were on point.

1. The interior of the laptop had too much dust, the fans were filled with dirt and other stuff:

<img style="max-width: 85%; margin: 0 auto; display: block;" src="dusty-laptop.jpeg" alt="dusty-laptop.jpeg">

2. The Liquid metal in the CPU was all over the place. There was a huge blank space on top of the CPU. This is what was causing uneven temperature of cores

<img style="max-width: 85%; margin: 0 auto; display: block;" src="cpu.jpeg" alt="cpu.jpeg">

3. The Thermal Paste on GPU was gone and dried out. This explained why the GPU was not reaching its frequency, and before that it was getting throttled.

<img style="max-width: 85%; margin: 0 auto; display: block;" src="gpu.jpeg" alt="gpu.jpeg">

4. You can see the corresponding spots on the heat sink as well:

<img style="max-width: 85%; margin: 0 auto; display: block;" src="heatsink.jpeg" alt="heatsink.jpeg">

After reapplying the thermal pads on GPU (ASUS Authorized), respreading the Liquid Metal on CPU (liquid metal never dries out, there was enough to just respread the same spill over liquid back on CPU) and cleaning the fans lets see if we got any results.

## Moment Of Truth:

1. Skyrocketed the Heaven Benchmark from **25 FPS** at **98&deg;C** it moved to **60FPS** at **60&deg;C**!

<img style="max-width: 85%; margin: 0 auto; display: block;" src="heaven-benchmark-2.png" alt="heaven-benchmark-2.png" />

2. Score on 3d test increased from **800** to **2400**

<img style="max-width: 85%; margin: 0 auto; display: block;" src="benchmark-2.png" alt="benchmark-2" />

3. At Valhalla jumped its FPS from **15 at 1080p** to **85 at 2K** !!!

<img style="max-width: 85%; margin: 0 auto; display: block;" src="ac-valhalla-2.png" alt="ac-valhalla-2" />

## Pushing The Limits

Now that the Rig seems to be working fine, lets push the limits and see the FPS of the Game at 4K Ultra Settings 😎

### AC Valhalla @4k Ultra

<img style="max-width: 85%; margin: 0 auto; display: block;" src="ac-valhalla-3.png" alt="ac-valhalla-3" />

### Evil Within 2 With @4K Ultra

<img style="max-width: 85%; margin: 0 auto; display: block;" src="evil-within-2.png" alt="evil within 2" />

**80FPS** with **65&deg;C** for GPU

## The End

Take care of your laptop's thermals. I hope this article helps people in the future facing similar issues. Thank you for your time!