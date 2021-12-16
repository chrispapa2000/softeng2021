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

    # Get Cursor
    cur = conn.cursor()
    s_id = sys.argv[1]
    #do some work
    cur.execute("SELECT Station_name FROM Station WHERE Station_id = ?", "OO05")
    print(cur)

    cur = conn.close()

    print("healthy")

main()
