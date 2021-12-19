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
        #print(conn, end = '')
        sys.exit(1)



    #print("healthy")

main()
