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
        print(f"Error connecting to MariaDB Platform: {e}")
        #print("unhealthy")
        sys.exit(1)

    # Get Cursor
    cur = conn.cursor()
    s_id = sys.argv[1]
    #do some work
    cur.execute("SELECT * FROM Pass WHERE stationStation_id = %s", (s_id,))
    result = cur.fetchall()
    #jsonObj = json.dumps(result)
    #print(result)
    print(len(result))
    i = 1
    for entry in result:
        str_time = entry[1].strftime("%Y")#/%m/%d %H:%M:%S")
        PassType = "visitor"
        if entry[3][0:2] == entry[4]:
            PassType = "home"
        cur.execute("SELECT Charge_amount FROM charge WHERE PassPass_id = %s", (entry[0],))
        charge_amount = cur.fetchall()[0][0]
        tup = (i, entry[0], str_time, entry[2], entry[4], PassType, charge_amount)
        print(tup)
        i += 1
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
