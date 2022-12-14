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
    op1 = sys.argv[1]
    op2 = sys.argv[2]
    time_s = datetime.datetime.strptime(sys.argv[3], "%Y%m%d")
    time_f = datetime.datetime.strptime(sys.argv[4], "%Y%m%d")
    cur.execute("SELECT * FROM Pass WHERE LEFT(stationStation_id, 2) = %s AND companyCompany_abbr = %s AND Timestamp > %s AND Timestamp < %s", (op1, op2, time_s, time_f))
    result = cur.fetchall()
    dic = dict()
    #print('{"op1_ID": "' + str(op1_ID) + '",')
    dic["op1_ID"] = op1
    #print('"StationOperator": "' + str(s_id[0:2]) + '",')
    dic["op2_ID"] = op2
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
        cur.execute("SELECT Charge_amount FROM charge WHERE PassPass_id = %s", (entry[0],))
        charge_amount = float(cur.fetchall()[0][0])
        tup = (i, entry[0], entry[3], str_time ,entry[2], charge_amount)
        d2 = dict()
        d2["PassIndex"] = i
        d2["PassID"] = entry[0]
        d2["StationID"] = entry[3]
        d2["TimeStamp"] = str_time
        d2["VehicleID"] = entry[2]
        d2["Charge"] = round(charge_amount, 2)
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
