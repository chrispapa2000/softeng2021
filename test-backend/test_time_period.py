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
            password="123",
            host="localhost",
            port=3306, #???
            database="interoperability_db"
        )

    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        sys.exit(1)

    # Get Cursor
    format = '%Y%m%d'
    cur = conn.cursor()
    station = sys.argv[1]
    datefrom = sys.argv[2]
    dateto = sys.argv[3]
    datefrom = datefrom[0] + datefrom[1] + datefrom[2] + datefrom[3] + "-" + datefrom[4] + datefrom[5] + "-" + datefrom[6] + datefrom[7]
    dateto = dateto[0] + dateto[1] + dateto[2] + dateto[3] + "-" + dateto[4] + dateto[5] + "-" + dateto[6] + dateto[7]
    #do some work

    cur.execute("SELECT Pass_id FROM Pass WHERE ((CAST(Pass.Timestamp AS date) BETWEEN %s AND %s) AND ((CAST(Pass.Timestamp AS time) BETWEEN %s AND %s)) AND (Pass.stationStation_id = %s))", (datefrom, dateto, "00:00:00", "07:59:59", station))
    res = cur.fetchall()
    print(len(res))
    cur.execute("SELECT Pass_id FROM Pass WHERE ((CAST(Pass.Timestamp AS date) BETWEEN %s AND %s) AND ((CAST(Pass.Timestamp AS time) BETWEEN %s AND %s)) AND (Pass.stationStation_id = %s))", (datefrom, dateto, "08:00:00", "15:59:59", station))
    res = cur.fetchall()
    print(len(res))
    cur.execute("SELECT Pass_id FROM Pass WHERE ((CAST(Pass.Timestamp AS date) BETWEEN %s AND %s) AND ((CAST(Pass.Timestamp AS time) BETWEEN %s AND %s)) AND (Pass.stationStation_id = %s))", (datefrom, dateto, "16:00:00", "23:59:59", station))
    res = cur.fetchall()
    print(len(res))

main()
