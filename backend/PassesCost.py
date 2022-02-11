import sys
import mariadb
import json
import datetime
import time
import csv

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
        sys.exit(1)

    # Get Cursor
    format = '%Y%m%d'
    cur = conn.cursor()
    op1 = sys.argv[1]
    op2 = sys.argv[2]
    datefrom = sys.argv[3]
    dateto = sys.argv[4]
    datefrom = datefrom[0] + datefrom[1] + datefrom[2] + datefrom[3] + "-" + datefrom[4] + datefrom[5] + "-" + datefrom[6] + datefrom[7]
    dateto = sys.argv[4]
    dateto = dateto[0] + dateto[1] + dateto[2] + dateto[3] + "-" + dateto[4] + dateto[5] + "-" + dateto[6] + dateto[7]
    #do some work

    #cur.execute("SELECT * FROM Pass WHERE Timestamp BETWEEN '2020-01-01' AND '2021-02-02'") #(datefrom, dateto))
    cur.execute("SELECT a.Charge_amount FROM charge a INNER JOIN Pass b on a.PassPass_id = b.Pass_id WHERE b.companyCompany_abbr = %s AND LEFT(b.stationStation_id, 2) = %s AND b.Timestamp BETWEEN %s AND %s", (op2, op1, datefrom, dateto))
    result = cur.fetchall()
    
    #jsonObj = json.dumps(result)
    #print(jsonObj)
    number_of_passes = len(result)
    totalcost = 0
    current_date = datetime.datetime.now()
    datefrom += " 00:00:00"
    dateto += " 00:00:00"
    for entry in result:
        totalcost += entry[0]
    json_data = {"op1_ID": op1, "op2_ID": op2, "RequestTimestamp": current_date.strftime("%d-%m-%Y %H:%M:%S"), "PeriodFrom": datefrom, "PeriodTo": dateto, "NumberOfPasses": number_of_passes, "PassesCost": totalcost}
    json_formatted_str = json.dumps(json_data, indent=2)
    print(json_formatted_str)
    cur = conn.close()
main()
