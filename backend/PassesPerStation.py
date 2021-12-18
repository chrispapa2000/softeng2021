import sys
import mariadb
import json
import datetime

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
    time_s = datetime.datetime.strptime(sys.argv[2], "%Y%m%d")
    time_f = datetime.datetime.strptime(sys.argv[3], "%Y%m%d")
    #do some work
    cur.execute("SELECT * FROM Pass WHERE stationStation_id = %s AND Timestamp > %s AND Timestamp < %s", (s_id, time_s, time_f,))
    result = cur.fetchall()
    #jsonObj = json.dumps(result)
    #print(result)
    print(s_id)
    print(s_id[0:2])
    now = datetime.datetime.now()
    print(now.strftime("%Y-%m-%d %H:%M:%S"))
    print(time_s)
    print(time_f)
    print(len(result))
    i = 1
    for entry in result:
        str_time = entry[1].strftime("%Y-%m-%d %H:%M:%S")
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
