Puck Application

This application encompasses all relevant information on anything NHL hockey related, from keeping tabs on game scores, statistics, standings, schedules, lineups, salary cap, and more! For everything an NHL enthusiasm needs, wants and more all in one location.



## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
``

### Run HTTPS Tunnel for Yahoo API Authentication
    ## go to C:\ngrok-v3-stable-windows-amd64
    ## run the terminal
    ## run 'ngrok http 5173' (whatever port the application is running on after npm run dev)
    ## change the redirect uri in Fantasy.vue and in the yahoo developer app page (check terminal for the forwarding uri) (https://developer.yahoo.com/apps/)
    ## https://yahoo-fantasy-api.readthedocs.io/en/latest/yahoo_fantasy_api.html ## fantasy api urls


#v1.1
    #Game page
        - Fixed v1_1 api call where clicking on a game caused error
    #Scores page
        - Started season dates at beginning of preseason instead of season
        - Added mouse scrolling functionality for dates on scores page
        - Added game tag label for preseason, playoffs, and specialty games
        - Added info label for days with no games
    #Fantasy page
        - Added fantasy hockey page
        - Implemeneted sign in functionality
    #Notes
        - added if else for v1_1 api calls (v1_1 expected to be perminently removed so look at removing it as well - it may be a trial version before implementing it directly to v1)