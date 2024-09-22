# Legends of Runestone 🪨🧙‍♂️📜

## Description

Legends of Runestone is an exciting fullstack RPG game currently under development. Built using Svelte for the frontend and C# (ASP.NET Core) for the backend, the game offers players the chance to create a unique character, battle fierce monsters, and level up as they gain experience. The game will also feature multiplayer support, allowing players to team up with friends to face powerful enemies in epic battles. 🧝‍♀️🧙‍♂️

As the game evolves, new features, storylines, and interactive elements will be added, ensuring a rich and engaging RPG experience.

## How to run

### Frontend 🦄

To run the frontend you need to have Node.js installed. You can download it [here](https://nodejs.org/en/).

After installing Node.js, you can run the following commands in the frontend folder:

```bash
npm install
npm start
```

This will start the development server, and your app will be accessible at [http://localhost:5173](http://localhost:5173) by default.

### Backend Development 🛠️🐉

Legends of Runestone RPG 🪨🧙‍♂️ project is powered by a custom-built API using C# (ASP.NET Core). The backend handles all character management, battles, and game progression logic. The backend is continuously under development to enhance gameplay features.

#### Links

Backend Repository: [C# RPG API Repository](https://github.com/andrenormanlang/csharp-rpg-api)

Hosted API Endpoint: [Azure deployed API](https://csharprpg.azurewebsites.net/api/)

To run the backend, first clone the repository C# RPG API and follow the instructions in its README file.

To run the backend be sure to have .NET Core installed. You can download it [here](https://dotnet.microsoft.com/download). ⚔️

After installing .NET Core, you can run the following commands in the backend folder:

```bash
dotnet run
```

## How to play 🎮

After running the frontend and backend, you can access the game in your browser at [http://localhost:5173](http://localhost:5173).

- **Create a Character:** Enter the game and create your character by selecting a name and class.
- **Battle Monsters:** Once your character is created, you can engage in battles with monsters.
- **Level Up:** Earn experience points by defeating enemies and level up your character.
- **Multiplayer:** Invite your friends to join the battle and defeat powerful foes together!

## Technologies Used 🛠️

- **Frontend:** Svelte, Tailwind CSS, DaisyUI
- **Backend:** C# (ASP.NET Core), MongoDB (or NeonDB, as per your project)
- **API Communication:** REST API with Axios
- **Multiplayer:** Socket.IO (if multiplayer is included)

## Development Roadmap 🚧

### Current Focus 🎯

- Implementing character creation and dice-based battle system.
- Adding basic multiplayer functionality.

### Future Enhancements 🌟

#### Improved Battle Mechanics 🎲⚔️

- Add dice animations during battles for a more dynamic experience. 🎲
- Multiple battle rounds where players and enemies gain or lose health based on dice rolls. .💥
- Implement more advanced AI for enemies, with varying strategies based on player level and health. 🧠

#### User Interface & Experience  🖼️🎨

- Enhance the battle UI with images for dice, and improve the overall UX with smoother animations. 🎯
- Add visuals for health bars, stamina, and mana. 📊

#### Character Development & Customization 🧝‍♀️⚒️

- Introduce new character classes, abilities, and attributes. ⚡
- Add leveling-up animations and visual indicators when a character gains experience or levels up. .🎉
- Display character models with custom assets based on the class in the UI. 🖌️

#### Storyline & Quests 🛤️📜

- Add a storyline to guide the player's journey, complete with quests and challenges. 🗺️
- Design unique regions with specific monsters and loot. 🏞️

#### Multiplayer & Social Features 👫🌐

- Allow real-time multiplayer battles where friends can join forces. 👥
- Implement a leaderboard system for tracking top players. 🏆

## TODOs 📝

### Database Enhancements 💾📷

- Add images to the character models in the MongoDB database to display custom avatars in-game. 🖼️
- Set up a more detailed item system in the database for future inventory management. 🛠️

### Frontend UX/UI 🖼️📱

- Add visual dice roll animations to enhance the battle experience. 🎲
- Add health/stamina/mana indicators for both player and enemies during battles. 💪
- Improve mobile responsiveness and design. 📱

### Gameplay Improvements ⚔️🎮

- Expand the combat system to include multiple rounds of battle, where players can lose or gain points based on their dice rolls.
- Integrate AI to adjust enemy difficulty dynamically based on player level or performance.
- **Update Battle Logic**: Introduce unique combat modes for different character classes:

🧙‍♂️ **Mages**

### Spellcasting
Mages can cast a variety of spells based on their level and mana pool. The spells are derived from Goetia and Enochian magic, each with distinct effects.

#### Goetia Magic
- Summoning demons, casting curses, and manipulating shadows. For example, a high-level spell might summon a powerful demon to fight alongside the mage.

#### Enochian Magic
- Focuses on celestial and elemental forces, such as calling down lightning, healing allies, or creating protective barriers.

### Mana Management
Mages must carefully manage their mana, as casting powerful spells depletes their resources. Mana potions and regeneration abilities can help maintain their spellcasting capabilities.

🛡️ **Paladins**

### Special Weapons and Armor
Paladins have access to unique weapons and armor that provide combat bonuses or special abilities.

#### Holy Weapons
- These weapons deal extra damage to undead and demonic enemies. For example, a “Sword of Light” might have a chance to blind enemies on hit.

#### Blessed Armor
- Provides enhanced protection and may grant abilities like damage reflection or temporary invulnerability.

### Divine Abilities
Paladins can call upon divine powers to heal allies, smite enemies, or create protective auras.

⚔️ **Warriors**

### Physical Combat
Warriors excel in close-quarters combat, using their strength and endurance to overpower enemies.

#### Powerful Strikes
- Abilities like “Cleave” or “Whirlwind” allow warriors to hit multiple enemies with a single attack.

#### Defensive Maneuvers
- Skills such as “Shield Block” or “Parry” reduce incoming damage and increase survivability.

### Rage Mechanic
Warriors build up rage through combat, which can be spent on powerful abilities or to enter a berserk state, increasing their damage output.

🪓 **Berserkers**

### Frenzied Combat
Berserkers thrive in the chaos of battle, using their rage to fuel devastating attacks.

### Berserk Mode
Entering a berserk state increases attack speed and damage but reduces defense. For example, a “Rage Burst” ability might temporarily double attack power at the cost of taking more damage.

### Brutal Strikes
Abilities like “Savage Slash” or “Frenzied Assault” deal massive damage to single targets or multiple enemies in a wide arc.

### Rage Management
Berserkers build up rage through taking and dealing damage, which can be spent on powerful abilities or to sustain their berserk state.

🗡️ **Rogues**

### Stealth and Evasion
Rogues rely on agility and cunning to outmaneuver opponents.

#### Stealth Attacks
- Abilities like “Backstab” or “Ambush” deal extra damage when attacking from stealth.

#### Traps and Gadgets
- Rogues can set traps to immobilize or damage enemies, and use gadgets like smoke bombs to escape dangerous situations.

#### Evasion Techniques
- Skills such as “Dodge” or “Shadowstep” allow rogues to avoid attacks and reposition themselves in battle.


🏹 **Rangers**

### Ranged Combat
Rangers specialize in long-range attacks using bows or crossbows.

### Precision Shots
- Abilities like “Snipe” or “Multi-Shot” allow rangers to deal high damage from a distance.

### Animal Companions
- Rangers can summon and control animal companions to assist in combat, each with unique abilities.

### Nature Magic
- Rangers can use nature-based spells to heal allies, entangle enemies, or enhance their own abilities.

💀 **Necromancers**

### Dark Magic
Necromancers wield dark magic to summon undead minions and cast debilitating curses.

### Summoning
- Abilities like “Raise Skeletons” or “Summon Wraith” bring forth undead creatures to fight for the necromancer.

### Curses
- Spells such as “Curse of Weakness” or “Plague” weaken enemies and spread disease.

### Life Drain
- Necromancers can drain the life force from enemies to heal themselves or replenish their mana.

🌿 **Druids**

### Shape-Shifting
Druids can transform into various animal forms, each with unique abilities.

#### Bear Form
- Increases strength and durability, making the druid a formidable melee combatant.

#### Eagle Form
- Enhances speed and agility, allowing for quick attacks and evasive maneuvers.

### Elemental Magic
Druids can harness the power of nature to cast spells that control the elements, such as summoning storms or causing earthquakes.

🧘‍♂️ **Monks**

### Martial Arts
Monks are masters of hand-to-hand combat, using their agility and inner strength to defeat enemies.

### Chi Techniques
Monks harness their inner energy, or chi, to perform extraordinary feats. For example, “Chi Burst” might release a wave of energy that damages all enemies in a line.

### Stances
Different stances provide various combat benefits. For instance, “Tiger Stance” increases attack speed and critical hit chance, while “Crane Stance” enhances evasion and counterattack abilities.

### Inner Peace
Monks maintain balance and focus through meditation and discipline, allowing them to heal themselves and allies or to resist harmful effects.

### Multiplayer 🌐🎮

- Implement real-time multiplayer using WebSockets (e.g., Socket.IO) to allow players to team up in battles. 🌍
- Create a lobby system for players to join forces and take on powerful enemies together. 🏰

## Stay Tuned for Updates 🎉

We're constantly working on making Legends of Eldoria a more immersive and exciting RPG experience. Keep checking back for updates and new features!
