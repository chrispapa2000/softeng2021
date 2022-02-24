# **Installation**

- Clone this repository
  > git clone https://github.com/ntua/TL21-57

- Install node.js, NPM, python3, pip and mariadb using:
  - For Debian based distros: 
    > sudo apt install nodejs npm python3 python3-pip mariadb-server
  - For Arch based distros:
    > sudo pacman -S nodejs npm python3 python-pip mariadb
- Install cors, request, yargs and global using npm:
  >npm i --save cors
  >
  >sudo npm install -g
  >
  >npm i yargs
  >
  >npm install request

- Install MariaDB Connector/C
  https://mariadb.com/docs/clients/mariadb-connectors/connector-c/install/
  - For Arch based distros:
    Install https://aur.archlinux.org/packages/mariadb-connector-c/
    > yay -S mariadb-connector-c

- Install python mariadb library:
  > pip3 install mariadb
- Install Apache Server as shown here:
  https://httpd.apache.org/docs/2.4/install.html
- Move/Copy the contents of the frontend folder in the default apache server folder (usually /srv/http/ or ~/public_html or /var/www/html/)
- Create a database user named "tolltrolls" with a password (default used: 123) and a database named "interoperability_db", then fill the database using the sql dump.
- If you used a different db username/password/db name make sure to change it accordingly on the backend files.
 






# **Usage**

- Start the API using:
  - > node myServer.js

- You can call the API using a typical http request from a browser or using an API platform like postman (https://www.postman.com)

- Example of call: http://localhost:9103/interoperability/api/chargesby/{op_id}/{start_date}/{end_date}

- CLI Usage:
  - > se2157 --help

- Frontend example: https://tolltrolls.tk/
