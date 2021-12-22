import sys
import mariadb

def main():

    try:
        conn = mariadb.connect(
            user="tolltrolls",
            password="diakopeskantere",
            host="tolltrolls.tk",
            port=3306, #???
            database="tolltrolls"
        )

        print(conn, end = '')
        cur = conn.close()

    except mariadb.Error as e:
        #print(f"Error connecting to MariaDB Platform: {e}")
        print(e, end = '')
        sys.exit(2)




    #print("healthy")

main()
