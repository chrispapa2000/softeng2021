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

    except mariadb.Error as e:
        #print(f"Error connecting to MariaDB Platform: {e}")
        print("unhealthy")
        sys.exit(1)

    print(conn)

    cur = conn.close()

    #print("healthy")

main()
