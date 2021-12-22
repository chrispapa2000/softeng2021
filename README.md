# **Installation**

- Clone this repository
  > git clone https://github.com/ntua/TL21-57

- Install node.js, NPM, python3, pip and mariadb using:
  - For Debian based distros: 
    > sudo apt install nodejs npm python3 python3-pip mariadb-server
  - For Arch based distros:
    > sudo pacman -S nodejs npm python3 python-pip mariadb

- Install MariaDB Connector/C
  https://mariadb.com/docs/clients/mariadb-connectors/connector-c/install/
  - For Arch based distros:
    Install https://aur.archlinux.org/packages/mariadb-connector-c/
    > yay -S mariadb-connector-c

- Install python mariadb library:
  > pip3 install mariadb
 






# **Usage**

- Start the API using:
  > node myServer.js

- You can call the API using a typical http request from a browser or using an API platform like postman (https://www.postman.com)

- Example of call: http://localhost:9103/interoperability/api/chargesby/{op_id}/{start_date}/{end_date}
