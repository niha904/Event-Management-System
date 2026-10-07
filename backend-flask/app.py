from flask import Flask,request,jsonify
from flask_cors import CORS
import sqlite3,re,os
app=Flask(__name__);CORS(app);DB=os.path.join(os.path.dirname(__file__),'ocean_events.db')
def con():
 c=sqlite3.connect(DB);c.row_factory=sqlite3.Row;c.execute('PRAGMA foreign_keys=ON');c.executescript('CREATE TABLE IF NOT EXISTS events(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,date TEXT NOT NULL,venue TEXT NOT NULL,capacity INTEGER NOT NULL);CREATE TABLE IF NOT EXISTS attendees(id INTEGER PRIMARY KEY AUTOINCREMENT,event_id INTEGER NOT NULL,name TEXT NOT NULL,email TEXT NOT NULL COLLATE NOCASE,ticket_type TEXT NOT NULL,FOREIGN KEY(event_id) REFERENCES events(id) ON DELETE CASCADE,UNIQUE(event_id,email));');return c
@app.get('/api/health')
def health(): return jsonify(status='ok',backend='Flask')
@app.get('/api/events')
def events():
 c=con();x=c.execute('SELECT e.*,COUNT(a.id) registered,e.capacity-COUNT(a.id) remaining FROM events e LEFT JOIN attendees a ON a.event_id=e.id GROUP BY e.id ORDER BY e.date').fetchall();c.close();return jsonify([dict(r) for r in x])
@app.post('/api/events')
def add():
 d=request.json or {};n=str(d.get('name','')).strip();date=str(d.get('date','')).strip();v=str(d.get('venue','')).strip();cap=d.get('capacity')
 if not n or not date or not v or not isinstance(cap,int) or cap<1:return jsonify(error='Required event fields missing.'),400
 c=con();cur=c.execute('INSERT INTO events(name,date,venue,capacity) VALUES(?,?,?,?)',(n,date,v,cap));c.commit();r=c.execute('SELECT * FROM events WHERE id=?',(cur.lastrowid,)).fetchone();c.close();return jsonify(dict(r)),201
@app.get('/api/attendees')
def ats():
 s=request.args.get('search','').strip();c=con();sql='SELECT a.*,e.name event_name FROM attendees a JOIN events e ON e.id=a.event_id '+('WHERE a.name LIKE ? OR a.email LIKE ? OR e.name LIKE ? ' if s else '')+'ORDER BY a.id DESC';p=[f'%{s}%']*3 if s else [];x=c.execute(sql,p).fetchall();c.close();return jsonify([dict(r) for r in x])
@app.post('/api/attendees')
def reg():
 d=request.json or {};eid=d.get('event_id');n=str(d.get('name','')).strip();em=str(d.get('email','')).strip().lower();t=d.get('ticket_type','Regular')
 if not eid or not n or not em:return jsonify(error='Required attendee fields missing.'),400
 if not re.match(r'^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',em):return jsonify(error='Invalid email format.'),400
 c=con();e=c.execute('SELECT e.*,COUNT(a.id) registered FROM events e LEFT JOIN attendees a ON a.event_id=e.id WHERE e.id=? GROUP BY e.id',(eid,)).fetchone()
 if not e:c.close();return jsonify(error='Event does not exist.'),404
 if e['registered']>=e['capacity']:c.close();return jsonify(error='Event is full.'),409
 if c.execute('SELECT id FROM attendees WHERE event_id=? AND email=?',(eid,em)).fetchone():c.close();return jsonify(error='Duplicate registration for this event.'),409
 try:cur=c.execute('INSERT INTO attendees(event_id,name,email,ticket_type) VALUES(?,?,?,?)',(eid,n,em,t));c.commit();r=c.execute('SELECT a.*,e.name event_name FROM attendees a JOIN events e ON e.id=a.event_id WHERE a.id=?',(cur.lastrowid,)).fetchone();c.close();return jsonify(dict(r)),201
 except Exception as x:c.close();return jsonify(error=str(x)),500
@app.delete('/api/events/<int:i>')
def de(i):
 c=con();c.execute('DELETE FROM events WHERE id=?',(i,));c.commit();c.close();return jsonify(message='Deleted')
@app.delete('/api/attendees/<int:i>')
def da(i):
 c=con();c.execute('DELETE FROM attendees WHERE id=?',(i,));c.commit();c.close();return jsonify(message='Removed')
if __name__=='__main__':con().close();app.run(port=5001,debug=True)
