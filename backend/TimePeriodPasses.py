import sys
import mariadb
import json
import datetime

def main():

    try:
        conn = mariadb.connect(
            user="tolltrolls",
            password="123",
            host="localhost",
            port=3306, #???
            database="interoperability_db"
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
    cur.execute("SELECT Timestamp FROM Pass WHERE stationStation_id = %s AND Timestamp > %s AND Timestamp < %s", (s_id, time_s, time_f,))
    result = cur.fetchall()
    dic = dict()
    dic["Station"] = s_id
    dic["StationOperator"] = s_id[0:2]
    now = datetime.datetime.now()
    dic["RequestTimestamp"] = now.strftime("%Y-%m-%d %H:%M:%S")
    dic["PeriodFrom"] = time_s.strftime("%Y-%m-%d %H:%M:%S")
    dic["PeriodTo"] = time_f.strftime("%Y-%m-%d %H:%M:%S")
    dic["NumberOfPasses"] = len(result)
    PeriodList = []
    counter1 = 0
    counter2 = 0
    counter3 = 0
    for timestamp in result:
        str_time = timestamp[0].strftime("%H")
        hour = int(str_time)
        if hour >= 0 and hour < 8:
            counter1 += 1
        elif hour >= 8 and hour < 16:
            counter2 += 1
        else:
            counter3 += 1

    dic2 = dict()
    dic2["Period"] = "00-08"
    dic2["Passes"] = counter1
    dic2["Percentage"] = counter1 / len(result)
    PeriodList.append(dic2)
    dic3 = dict()
    dic3["Period"] = "08-16"
    dic3["Passes"] = counter2
    dic3["Percentage"] = counter2 / len(result)
    PeriodList.append(dic3)
    dic4 = dict()
    dic4["Period"] = "16-00"
    dic4["Passes"] = counter3
    dic4["Percentage"] = counter3 / len(result)
    PeriodList.append(dic4)
    dic["PeriodList"] = PeriodList
    
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
