import React, { useState, useEffect} from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab2.css';
import { useStorageSQLite } from 'react-data-storage-sqlite-hook/dist';

const Tab2: React.FC = () => {
  const [log, setLog] = useState<string[]>([]);

  const {openStore, getItem, setItem, getAllKeys, getAllValues,
    getFilterValues, getAllKeysValues, isKey, setTable,
    removeItem, clear} = useStorageSQLite();
  useEffect(() => {
    async function testSimpleStore() {
      setLog((log) => log.concat("Tab 2 page\n")); 
      const resOpen =  await openStore({});
      if(resOpen) {
        await setItem('name', 'Jeep');
        const val = await getItem('name');
        await setItem('message', 'Hello World from ');
        const mess = await getItem('message');
        if( mess && val ) setLog((log) => log.concat(mess + val + "\n")); 

        const keys = await getAllKeys();
        setLog((log) => log.concat("keys : " + keys.length + "\n"));
        for(let i: number = 0;i< keys.length;i++) {
          setLog((log) => log.concat('key[' + i + "] = " + keys[i] + "\n"));
        }
        const values = await getAllValues();
        setLog((log) => log.concat("values : " + values.length + "\n"));
        for(let i: number = 0;i< values.length;i++) {
          setLog((log) => log.concat('value[' + i + "] = " + values[i] + "\n"));
        }
        const keysvalues = await getAllKeysValues();
        setLog((log) => log.concat("keysvalues : " + keysvalues.length + "\n"));
        for(let i: number = 0;i< keysvalues.length;i++) {
          setLog((log) => log.concat(' key[' + i + "] = " + keysvalues[i].key +
            ' value[' + i + "] = " + keysvalues[i].value  + "\n"));
        }
        const iskey = await isKey('name');
        setLog((log) => log.concat('iskey name ' + iskey + "\n")); 
        const iskey1 = await isKey('foo');
        setLog((log) => log.concat('iskey foo ' + iskey1 + "\n")); 
        const r = await setTable("testtable");
        setLog((log) => log.concat('set table "testtable" result ' + r.result + " message " +
              r.message + "\n")); 
        console.log("r " + r.result + " message " + r.message);
        if(r.result) {
          await setItem('name', 'Jeepq');
          await setItem('email', 'Jeepq@example.com');
          await setItem('tel', '2255443315');
          const name = await getItem('name');
          if( name ) setLog((log) => log.concat(name + "\n")); 
          const email = await getItem('email');
          if( email ) setLog((log) => log.concat(email + "\n")); 
          const tel = await getItem('tel');
          if( tel ) setLog((log) => log.concat(tel + "\n")); 
          const res = await removeItem('tel')
          if( res ) setLog((log) => log.concat("remove tel " + res + "\n")); 
          const iskey = await isKey('tel');
          setLog((log) => log.concat('iskey tel ' + iskey + "\n")); 
            const rClear = await clear();
          if( rClear ) setLog((log) => log.concat('clear table "testtable" ' + res + "\n")); 
          // store data to test getFilterValues
          await setItem("session","Session Lowercase Opened");
          const data = {'a':20,'b':'Hello World','c':{'c1':40,'c2':'cool'}};
          await setItem("testJson",JSON.stringify(data));
          await setItem("Session1","Session Uppercase 1 Opened");
          await setItem("MySession2foo","Session Uppercase 2 Opened");
          const data1 = 243.567;
          await setItem("testNumber",data1.toString());
          await setItem("Mylsession2foo","Session Lowercase 2 Opened");
          await setItem("EnduSession","Session Uppercase End Opened");
          await setItem("Endlsession","Session Lowercase End Opened");
          await setItem("SessionReact","Session React Opened");
          // Get All Values
          const values: string[] = await getAllValues();
          if(values.length !== 9) {
            setLog((log) => log.concat("getAllValues failed \n"));
          } else {
            for(let i = 0; i< values.length;i++) {
              setLog((log) => log.concat(' key[' + i + "] = " + values[i] + "\n"));
            }
            setLog((log) => log.concat("getAllValues was successful \n"));
          }
          // Get Filter Values Starting with "session"
          const stValues: string[] = await getFilterValues("%session");
          if(stValues.length !== 3) {
            setLog((log) => log.concat("getFilterValues Start failed \n"));
          } else {
            for(let i = 0; i< stValues.length;i++) {
              setLog((log) => log.concat(' key[' + i + "] = " + stValues[i] + "\n"));
            }
            setLog((log) => log.concat("getFilterValues Start was successful \n"));
          }
          // Get Filter Values Ending with "session"
          const endValues: string[] = await getFilterValues("session%");
          if(endValues.length !== 3) {
            setLog((log) => log.concat("getFilterValues End failed \n"));
          } else {
            for(let i = 0; i< endValues.length;i++) {
              setLog((log) => log.concat(' key[' + i + "] = " + endValues[i] + "\n"));
            }
            setLog((log) => log.concat("getFilterValues Start was successful \n"));
          }
          // Get Filter Values Containing "session"
          const contValues: string[] = await getFilterValues("session");
          if(contValues.length !== 7) {
            setLog((log) => log.concat("getFilterValues End failed \n"));
          } else {
            for(let i = 0; i< contValues.length;i++) {
              setLog((log) => log.concat(' key[' + i + "] = " + contValues[i] + "\n"));
            }
            setLog((log) => log.concat("getFilterValues Start was successful \n"));
          }
   
        }
      }
    }
    testSimpleStore();
  }, [ openStore, getItem, setItem, getAllKeys, getAllValues,
    getFilterValues, getAllKeysValues, isKey, setTable,
    removeItem, clear]);   


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
        <pre>
          <p>{log}</p>
        </pre>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
