## THIS IS AN ARCHIVE; NO BUILDS WILL BE PROVIDED
(although you can still build from source if you wish)

This is simply an archive of the ynodesktop github which was seemingly removed around the [11th of August, 2024](https://github.com/joaovitorbf/joaovitorbf/commit/096f42041f483f51e434cc2c6bb39027b43d0431).
If joaovitorbf would like this removed (as it seemed intentional) please contact me on discord at icebro and I'll be happy to remove it. The only reason I've reuploaded this is, as stated earlier, is for archival purposes.


![ynodesk](https://user-images.githubusercontent.com/2998216/201456135-270da105-a4fa-4976-a69a-3a69e5d3fe59.png)

  

A desktop client for [Yume Nikki Online](https://ynoproject.net/) with Discord Rich Presence. Show your friends what game you're playing and what room you're in. Also looks pretty cool as an installed program.

  

Created as a simple Electron wrapper around the website, with `discord-rpc` and some hacks to make save exporting/importing work.

  

## Features

- Display your game status and room information to friends on Discord.

- Easy installation and setup.

- Smooth integration with Yume Nikki Online.

  

## Rich Presence

![Rich Presence Example 1](https://user-images.githubusercontent.com/2998216/201456282-6337d763-db5c-4fc2-b399-00b3513b1f7b.png)

![Rich Presence Example 2](https://user-images.githubusercontent.com/2998216/201456297-8cb36ebb-6400-4ae8-9804-ce51bcf3c1b5.png)

  

## Download

The releases are currently Windows-only.

[Click here to go to the download page for the latest release.](https://github.com/joaovitorbf/ynodesktop/releases/latest)

  

## Development Setup

To set up the project locally, you need to have [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/) installed. Then follow these steps:

  

1. Clone the repository:

```sh

git clone https://github.com/joaovitorbf/ynodesktop.git

cd ynodesktop

```

  

2. Install dependencies:

```sh

yarn install

```

  

3. Run the application:

```sh

yarn start

```

  

## Building the Project

To build the project, use the following command:

```sh

yarn dist

```

This will create the distributable files in the `dist` directory.

  

## Project Structure

-  `main.js`: The main entry point of the application.

-  `package.json`: Contains project metadata and dependencies.

-  `yarn.lock`: Dependency lock file to ensure consistent setups.

  

## Contributing

Feel free to fork the repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

  

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

  

## YNOproject

Click on the heading to check out the [Yume Nikki Online Project](https://github.com/ynoproject)!  
Make sure to check out Collective Unconscious, YNO's own multiplayer collaborative Yume Nikki Fangame!
