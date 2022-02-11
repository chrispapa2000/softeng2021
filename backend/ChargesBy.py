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
    op_id = sys.argv[1]
    time_s = datetime.datetime.strptime(sys.argv[2], "%Y%m%d")
    time_f = datetime.datetime.strptime(sys.argv[3], "%Y%m%d")
    
    dic = dict()
    #print(op_id)
    dic["op_id"] = op_id
    now = datetime.datetime.now()
    #print(now.strftime("%Y-%m-%d %H:%M:%S"))
    dic["RequestTimestamp"] = now.strftime("%Y-%m-%d %H:%M:%S")
    #print(time_s)
    dic["PeriodFrom"] = time_s.strftime("%Y-%m-%d %H:%M:%S")
    #print(time_f)
    dic["PeriodTo"] = time_f.strftime("%Y-%m-%d %H:%M:%S")
    
    companies = ["AO", "KO", "GF", "NE", "EG", "MR", "OO"]
    PPOList = []
    for comp in companies:
        if comp == op_id:
            continue
        cur.execute("SELECT Charge_amount FROM charge WHERE charge.PassPass_id IN (SELECT Pass_id FROM Pass WHERE LEFT(stationStation_id, 2) = %s AND companyCompany_abbr = %s AND Timestamp > %s AND Timestamp < %s)", (op_id, comp, time_s, time_f,))
        result = cur.fetchall()
        
        sum = 0
        for entry in result:
            sum += entry[0]
        
        if sum == 0:
            continue
            
        tup = (comp, len(result), sum)
        #print(tup)
        d2 = dict()
        d2["VisitingOperator"] = comp
        d2["NumberOfPasses"] = len(result)
        d2["PassesCost"] = round(sum, 1)
        PPOList.append(d2)


    cur = conn.close()
    
    dic["PPOList"] = PPOList

    fin = json.dumps(dic, indent = 2)
    print(fin)

main()
