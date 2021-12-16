import sys
import mariadb
import json

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
        #print("unhealthy")
        sys.exit(1)

    # Get Cursor
    cur = conn.cursor()
    s_id = sys.argv[1]
    #do some work
    cur.execute("SELECT * FROM Pass WHERE stationStation_id = %s", (s_id,))
    result = cur.fetchall()
    i=0
    #jsonObj = json.dumps(result)
    for entry in result:
        print(entry)
    #print(jsonObj)
    """
    for line in result:
        print(i)
        i+=1
        print(line)
        """
    cur = conn.close()
    #print("length = " + str(len(result)))
    #print("healthy")

main()
