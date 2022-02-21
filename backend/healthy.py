import sys
import mariadb

def main():

    try:
        conn = mariadb.connect(
            user="tolltrolls",
            password="123",
            host="localhost",
            port=3306, #???
            database="interoperability_db"
        )

        print(conn, end = '')
        cur = conn.close()

    except mariadb.Error as e:
        #print(f"Error connecting to MariaDB Platform: {e}")
        print(e, end = '')
        sys.exit(2)




    #print("healthy")

main()
