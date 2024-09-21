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

### Multiplayer 🌐🎮

- Implement real-time multiplayer using WebSockets (e.g., Socket.IO) to allow players to team up in battles. 🌍
- Create a lobby system for players to join forces and take on powerful enemies together. 🏰

## Stay Tuned for Updates 🎉

We're constantly working on making Legends of Eldoria a more immersive and exciting RPG experience. Keep checking back for updates and new features!
