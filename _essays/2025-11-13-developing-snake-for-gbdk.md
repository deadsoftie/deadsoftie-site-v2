---
title: "Developing Snake on GBDK-2020"
date: 2025-11-13
tags: [gamedev]
summary: >
  Building a Snake workshop for Game Boy development using GBDK-2020. LCG
  RNG, sprite limits, bitplanes, and the limits of an 8-bit CPU.
read_time: 8
featured: true
toc: true
---

I have come to thoroughly enjoy my time at DigiPen as a grad student. Dipping my toes in several different areas of interest. One of those areas being developing games for retro consoles. Something about creating games with constraints spoke to me so when my friends and I founded the Retro Development Association at DigiPen the tagline we chose was, "Limitation breeds Creativity".

As such, when it came to designing a workshop that allowed an entry point into Game Boy development (using GBDK-2020) the simplest game I could think of was the original Snake. The one I spent countless hours of the day playing on my Mom's old Nokia.

## Why Snake?

Cause it covers all the basics that a game needs to have. A simple game mechanic involving character movement, incrementing of score, game over (due to wall or self) and repeat. Obviously, most of these things cannot be covered in a single hours' worth of workshop, so I did have to cut a good chunk of the mechanics.

Coverage of my workshop was limited to:

- Basic GBDK setup and installation
- Designing over the hardware limitations of the Game Boy
- Implementing the core snake mechanics (snake movement and food)
- Screen wrapping
- A long dedicated prayer to God for compilation

> All of the instructions and implementation details along with the starter template are provided in the GitHub repository: [GBDK-2020 Workshop](https://github.com/deadsoftie/gbdk-2020-workshop)

## Key Learnings

I had a great learning experience developing and hosting this workshop. The following were perhaps my three biggest learnings from it.

### Getting over hardware limitations

#### RNG

One of the core mechanics in the game is the random food item drop. Something that requires an RNG (Random Number Generator) implementation. The problem is that GBDK itself runs on an older, limited C compiler which cannot handle standard library functions like `rand()` and `srand()` from the modern C language.

The solution? Make my own rand function that will give me more control over the speed, range and seed behavior. I went with a very common RNG choice which was to use a **LCG (Linear Congruential Generator)**. It is fast and easy to implement on an 8-bit CPU.

```c
static uint16_t rng_state = 0xACE1u;
uint8_t rand8(void) {
    rng_state = rng_state * 1103515245u + 12345u;
    return (uint8_t)(rng_state >> 8);
}
```

#### Sprites limit

This one was more of a surprise and something that I should have anticipated early on but forgot to. Mid-way through development, I noticed that I was getting a warning from the BGB emulator ("This won't run on an actual game boy!"). Why? Because at some point during runtime I was exceeding the 40 sprites limit that the Game Boy has.

> The Game Boy has a 40 sprite limit per frame, but it is also limited to 10 sprites per horizontal scanline.

Obviously, fixing the horizontal rendering was too much for the scope of this workshop but fixing the sprite limit was well within scope.

```c
#define MAX_SPRITES 40
#define FOOD_SPRITE_INDEX 39
#define MAX_SNAKE (FOOD_SPRITE_INDEX) // 39 segments max
```

Basic definitions to make sure that we never surpass the limit and the max number of food sprites during the entire game's runtime would be 39, hence the maximum possible length for the snake is 39 as well.

As you might have noticed already? This will obviously cause problems when we eventually touch the limits. My solution? Ignore it for this workshop. **Know the limits for an hour!**

### Easier array implementation

For the snake position and its corresponding segments I found an easier convention for the shifting elements which was to just consider the head as the last element of the array `snake_len - 1` and the tail as index 0.

Why this way? Because it makes the shifting logic extremely simpler.

When the snake moves:

1. Shift every element towards the index 0: `snake_x[i] = snake_x[i+1]`, which makes each segment take the position of the next segment (closer to the head).
2. Find the new head position based on the direction and put it in the `snake_x[snake_len-1]` position.

### Bitplanes

This was perhaps the most exciting learning for me when developing this workshop. Because I had no idea about this concept let alone know how it worked on the Game Boy.

Before even understanding the problem I must first explain what bitplanes are. Bitplanes are essentially a collection of bits associated with a position in an image. When I say I have an 8-bit image, I am essentially saying that I have an image that uses 8 bit planes with its own values which when combined would be an overlay of eight bits per pixel.

When it comes to the Game Boy, we need to set these bit plane values for the 8×8 tiles that are used within the screen. Once we do that we can use the `set_sprite_data` function to load the pattern (in this case the filled tile values) and send it to the Game Boy video RAM.

1. Each 8×8 tile on the Game Boy uses **2 bitplanes**, so 16 bytes per tile. `tile_filled[16]` holds those bytes.
2. `set_sprite_data(0, 1, tile_filled);` tells the system: put 1 tile starting at tile index 0 using the provided bytes.
3. `set_sprite_tile(sprite_index, tile_number);` binds a sprite to that tile pattern.
4. Without loading a tile, the sprite has no pixels (or garbage).

## Conclusion

All in all, I had a lot of fun hosting this workshop. Learnt a lot of new things and got to share it with my club members. I also have profound respect for the ingenious people who worked on these consoles and the path that they paved for the next generations that came. I don't even want to imagine what debugging code might have been like on these systems.
