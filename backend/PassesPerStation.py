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
    cur.execute("SELECT * FROM Pass WHERE stationStation_id = %s AND Timestamp > %s AND Timestamp < %s", (s_id, time_s, time_f,))
    result = cur.fetchall()
    dic = dict()
    #print('{"Station": "' + str(s_id) + '",')
    dic["Station"] = s_id
    #print('"StationOperator": "' + str(s_id[0:2]) + '",')
    dic["StationOperator"] = s_id[0:2]
    now = datetime.datetime.now()
    #print('"RequestTimestamp": "' + str(now.strftime("%Y-%m-%d %H:%M:%S")) + '",')
    dic["RequestTimestamp"] = now.strftime("%Y-%m-%d %H:%M:%S")
    #print('"PeriodFrom": "' + str(time_s) + '",')
    dic["PeriodFrom"] = time_s.strftime("%Y-%m-%d %H:%M:%S")
    #print('"PeriodTo": "' + str(time_f), '",')
    dic["PeriodTo"] = time_f.strftime("%Y-%m-%d %H:%M:%S")
    #print('"NumberOfPasses": "' + str(len(result)) + '",')
    dic["NumberOfPasses"] = len(result)
    #print('"PassesList": [')
    PassesList = []
    i = 1
    for entry in result:
        str_time = entry[1].strftime("%Y-%m-%d %H:%M:%S")
        PassType = "visitor"
        if entry[3][0:2] == entry[4]:
            PassType = "home"
        cur.execute("SELECT Charge_amount FROM charge WHERE PassPass_id = %s", (entry[0],))
        charge_amount = cur.fetchall()[0][0]
        tup = (i, entry[0], str_time, entry[2], entry[4], PassType, charge_amount)
        d2 = dict()
        d2["PassIndex"] = i
        d2["PassID"] = entry[0]
        d2["PassTimeStamp"] = str_time
        d2["VehicleID"] = entry[2]
        d2["TagProvider"] = entry[4]
        d2["PassType"] = PassType
        d2["PassCharge"] = charge_amount
        PassesList.append(d2)
        i += 1

    dic["PassesList"] = PassesList
    
    j = json.dumps(dic, indent = 2)
    
    """
    csv = True#False
    if csv:
        import pandas as pd
        df = pd.json_normalize(dic)
        c = df.to_csv()
        print(c)
    else:
        print(j)
    """

    print(j)

    cur = conn.close()

main()
