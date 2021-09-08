import React, { useState, useEffect, useRef} from 'react';
import { IonCardContent, IonContent, IonHeader, IonPage, IonTitle,
         IonToolbar, IonCard } from '@ionic/react';
import './Tab2.css';
import { useStorageSQLite } from 'react-data-storage-sqlite-hook/dist';
import { Dialog } from '@capacitor/dialog';

const Tab2: React.FC = () => {
  const [log, setLog] = useState<string[]>([]);
  const errMess = useRef("");
  const showAlert = async (message: string) => {
      await Dialog.alert({
        title: 'Error Dialog',
        message: message,
      });
  };

  const {echo, getPlatform, openStore, closeStore, isStoreOpen, isStoreExists,
    deleteStore, getItem, setItem, getAllKeys, getAllValues,
    getFilterValues, getAllKeysValues, isKey, setTable,
    removeItem, clear, isTable, getAllTables, deleteTable,
    isJsonValid, importFromJson, exportToJson, isAvailable} = useStorageSQLite();
  useEffect(() => {
    const testSimpleStore = async (): Promise<boolean> => {
      setLog((log) => log.concat("* Tab 2 Page Start testSimpleStore Test\n")); 
      try {

        await openStore({});
        await clear();
        await setItem('name', 'Jeep');
        const val = await getItem('name');
        await setItem('message', 'Hello World from ');
        const mess = await getItem('message');
        if( mess && val ) setLog((log) => log.concat(" > " + mess + " " + val + "\n")); 

        const keys = await getAllKeys();
        setLog((log) => log.concat(" > keys : " + keys.length + "\n"));
        for(let i: number = 0;i< keys.length;i++) {
          setLog((log) => log.concat(' >> key[' + i + "] = " + keys[i] + "\n"));
        }
        let values: string[] = await getAllValues();
        setLog((log) => log.concat(" > values : " + values.length + "\n"));
        for(var i in values) {
          // eslint-disable-next-line no-loop-func
          setLog((log) => log.concat(` >> value[${i}] = ${values[i]} \n`));
        }
        const keysvalues = await getAllKeysValues();
        setLog((log) => log.concat(" > keysvalues : " + keysvalues.length + "\n"));
        for(let i: number = 0;i< keysvalues.length;i++) {
          setLog((log) => log.concat(' >> key[' + i + "] = " + keysvalues[i].key +
            ' value[' + i + "] = " + keysvalues[i].value  + "\n"));
        }
        let iskey: boolean = await isKey('name');
        setLog((log) => log.concat(` > iskey name ${iskey} \n`)); 
        const iskey1 = await isKey('foo');
        setLog((log) => log.concat(` > iskey foo ${iskey1}\n`)); 
        await setTable("testtable");
        setLog((log) => log.concat(` > set table "testtable" result \n`)); 
        await setItem('name', 'Jeepq');
        await setItem('email', 'Jeepq@example.com');
        await setItem('tel', '2255443315');
        const name = await getItem('name');
        if( name != null ) setLog((log) => log.concat(" > " + name + "\n")); 
        const email = await getItem('email');
        if( email != null ) setLog((log) => log.concat(" > " + email + "\n")); 
        const tel = await getItem('tel');
        if( tel != null ) setLog((log) => log.concat(" > " + tel + "\n")); 
        await removeItem('tel')
        setLog((log) => log.concat(` > remove tel \n`)); 
        iskey = await isKey('tel');
        setLog((log) => log.concat(' > iskey tel ' + iskey + "\n")); 
        await clear();
        setLog((log) => log.concat(` > clear table "testtable" \n`)); 
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
        values = await getAllValues();
        if(values.length !== 9) {
          setLog((log) => log.concat(" > getAllValues failed \n"));
          return false;
        } else {
          for(let i = 0; i< values.length;i++) {
            setLog((log) => log.concat(' key[' + i + "] = " + values[i] + "\n"));
          }
          setLog((log) => log.concat(" > getAllValues was successful \n"));
        }
        // Get Filter Values Starting with "session"
        const stValues: string[] = await getFilterValues("%session");
        if(stValues.length !== 3) {
          setLog((log) => log.concat(" > getFilterValues Start failed \n"));
        } else {
          for(let i = 0; i< stValues.length;i++) {
            setLog((log) => log.concat(' >> key[' + i + "] = " + stValues[i] + "\n"));
          }
          setLog((log) => log.concat(" > getFilterValues Start was successful \n"));
        }
        // Get Filter Values Ending with "session"
        const endValues: string[] = await getFilterValues("session%");
        if(endValues.length !== 3) {
          setLog((log) => log.concat(" > getFilterValues End failed \n"));
        } else {
          for(let i = 0; i< endValues.length;i++) {
            setLog((log) => log.concat(' >> key[' + i + "] = " + endValues[i] + "\n"));
          }
          setLog((log) => log.concat(" > getFilterValues End was successful \n"));
        }
        // Get Filter Values Containing "session"
        const contValues: string[] = await getFilterValues("session");
        if(contValues.length !== 7) {
          setLog((log) => log.concat(" > getFilterValues Contain failed \n"));
          setLog((log) => log.concat("* Tab 2 Page End Test failed\n")); 
        } else {
          for(let i = 0; i< contValues.length;i++) {
            setLog((log) => log.concat(' >> key[' + i + "] = " + contValues[i] + "\n"));
          }
          setLog((log) => log.concat(" > getFilterValues Contain was successful \n"));
        }
        const platform = await getPlatform();
        if(platform.platform !== "web") {
          let isStore = await isStoreExists({})
          setLog((log) => log.concat(` > isStoreExists ${isStore} \n`));
          if(!isStore) {
            errMess.current = `isStoreExists 1 failed`;
            return false;
          }
          const isOpen = await isStoreOpen({})
          setLog((log) => log.concat(` > isStoreOpen ${isOpen} \n`));
          if(!isOpen) {
            errMess.current = `isStoreOpen failed`;
            return false;
          }
          let isTableExists = await isTable({table: "testtable"})
          setLog((log) => log.concat(` > isTableExists ${isTableExists} \n`));
          if(!isTableExists) {
            errMess.current = `isTable 1  failed`;
            return false;
          }
          const tables: string[] = await getAllTables();
          setLog((log) => log.concat(` > getAllTables ${tables.length} \n`));
          await deleteTable({table: "testtable"});
          isTableExists = await isTable({table: "testtable"})
          setLog((log) => log.concat(` > isTableExists ${isTableExists} \n`));
          if(isTableExists) {
            errMess.current = `isTable 2 failed`;
            return false;
          }
          await closeStore({});
          await deleteStore({});
          isStore = await isStoreExists({})
          if(isStore) {
            errMess.current = `isStoreExists 2 failed`;
            return false;
          }

        }
        setLog((log) => log.concat("* Tab 2 Page End testSimpleStore Test successful\n")); 
        return true;
      } catch (err) {
        errMess.current = `${err}`;
        return false;
      }
    }
    const testJsonMethods = async (): Promise<boolean> => {
      setLog((log) => log.concat("* Tab 2 Page Start testJsonMethods Test\n")); 
      const jsonData1 = {
        database: "testImport",
        encrypted: false,
        tables: [
          {
            name: "myStore1",
            values: [
              {key: "test1", value: "my first test"},
              {key: "test2", value: JSON.stringify({a: 10, b: 'my second test', c:{k:'hello',l: 15}})},
            ]
          },
          {
            name: "myStore2",
            values: [
              {key: "test1", value: "my first test in store2"},
              {key: "test2", value: JSON.stringify({a: 20, b: 'my second test in store2 ', d:{k:'hello',l: 15}})},
              {key: "test3", value: "100"},
            ]
          },
        ]
      }
      const jsonData2 = {
        database: "testJsonEncrypted",
        encrypted: true,
        tables: [
          {
            name: "myStore1",
            values: [
              {key: "etest1", value: "my first test"},
              {key: "etest2", value: JSON.stringify({a: 10, b: 'my second test', c:{k:'hello',l: 15}})},
            ]
          },
          {
            name: "myStore2",
            values: [
              {key: "etest1", value: "my first test in store2"},
              {key: "etest2", value: JSON.stringify({a: 20, b: 'my second test in store2 ', d:{k:'hello',l: 15}})},
              {key: "etest3", value: "100"},
            ]
          },
        ]
      }
      try {
        const bRet = await isJsonValid(JSON.stringify(jsonData1));
        setLog((log) => log.concat(` > isJsonValid ${bRet} \n`));
        if(!bRet) {
          errMess.current = `isJsonValid jsonData1 not valid`;
          return false;
        }
        await importFromJson(JSON.stringify(jsonData1));
        setLog((log) => log.concat(` > importFromJson jsonData1 successful \n`));
        await openStore({database: "testImport", table: "myStore1"});
        // test isKey
        let result = await isKey("test1");
        setLog((log) => log.concat(` > isKey myStore1 test1 ${result} \n`));
        if(!result) {
          errMess.current = "isKey myStore1 test1 failed";
          return false;
        }
        result = await isKey("test2");
        setLog((log) => log.concat(` > isKey myStore1 test2 ${result} \n`));
        if(!result) {
          errMess.current = "isKey myStore1 test2 failed";
          return false;
        }
        // test getAllKeys
        let resKeys = await getAllKeys();
        setLog((log) => log.concat(` > Get keys myStore1 result ${resKeys} \n`));
    
        if(resKeys.length !== 2 || resKeys[0] !== "test1"
            || resKeys[1] !== "test2") {
          errMess.current = "getAllKeys myStore1 failed";
          return false;
        }
        
        // test getAllValues
        let resValues = await getAllValues();
        setLog((log) => log.concat(` > Get values myStore1 result ${resValues} \n`));
        if(resValues.length !== 2 || resValues[0] !== "my first test"
            || resValues[1] !== JSON.stringify({a: 10, b: 'my second test', c:{k:'hello',l: 15}})) {
          errMess.current = "getAllValues myStore1 failed";
          return false;
        }
  
        // get store 2
        await setTable("myStore2");
        // test getAllKeys
        resKeys = await getAllKeys();
        setLog((log) => log.concat(` > Get keys myStore2 result ${resKeys} \n`));
    
        if(resKeys.length !== 3 || resKeys[0] !== "test1"
            || resKeys[1] !== "test2" || resKeys[2] !== "test3") {
          errMess.current = "getAllKeys myStore2 failed";
          return false;
        }
        // test getAllValues
        resValues = await getAllValues();
        setLog((log) => log.concat(` > Get values myStore2 result ${resValues} \n`));
        if(resValues.length !== 3 || resValues[0] !== "my first test in store2"
            || resValues[1] !== JSON.stringify({a: 20, b: 'my second test in store2 ', d:{k:'hello',l: 15}})
            || resValues[2] !== "100") {
          errMess.current = "getAllValues myStore2 failed";
          return false;
        }
        // close the store
        const platform = await getPlatform();
        if(platform.platform !== "web") {
          await closeStore({database:"testImport"});
        }
        // exportToJson
        await openStore({database:"testImport", table: "myStore1"});
        const retJson = await exportToJson();
        setLog((log) => log.concat(` > exportToJson successful \n`));
        if(retJson.tables.length !== 2 
          || retJson.tables[0].name !== "myStore1"
          || retJson.tables[0].values?.length !== 2
          || retJson.tables[1].name !== "myStore2"
          || retJson.tables[1].values?.length !== 3
        ) {
          errMess.current = "exportToJson failed";
          return false;
        }
        const bRetEx = await isJsonValid(JSON.stringify(retJson));
        setLog((log) => log.concat(` > isJsonValid exported Json object ${bRet} \n`));
        if(!bRetEx) {
          errMess.current = "returned exported json object not valid";
          return false;
        }
        const tables: string[] = await getAllTables();
        setLog((log) => log.concat(` > Get tables result ${tables} \n`));
        if(tables.length !== 2 || tables[0] !== "myStore1" || tables[1] !== "myStore2") {
          errMess.current = "getAllTables exported json object failed";
          return false;
        }
        let res: boolean = await isTable({table: "myStore1"});
        if(!res) {
          errMess.current = "isTable myStore1 failed";
          return false;
        }
        res = await isTable({table: "myFoo"});
        if(res) {
          errMess.current = "isTable myFoo failed";
          return false;
        }
        resValues = await getAllValues();
        setLog((log) => log.concat(` > Get values myStore1 result ${resValues} \n`));
        if(resValues.length !== 2 || resValues[0] !== "my first test"
            || resValues[1] !== JSON.stringify({a: 10, b: 'my second test', c:{k:'hello',l: 15}})) {
          return Promise.reject(new Error("getAllValues failed"));
        }
        if (platform.platform === "ios" || platform.platform === "android") {
          // test encrypted
          const bERet = await isJsonValid(JSON.stringify(jsonData2));
          setLog((log) => log.concat(` > isJsonValid jsonData2 ${bRet} \n`));
          if(!bERet) {
            errMess.current = "isJsonValid jsonData2 not valid";
            return false;
          }      
        }
        setLog((log) => log.concat("* Tab 2 Page End testJsonMethods Test successful\n")); 
        return true;
      } catch (err) {
        errMess.current = `${err}`;
        return false;
      }
    }

    if (isAvailable) {
      testSimpleStore().then(async res => {
        if(res) { 
          testJsonMethods().then(async res => {
            if(res) {
              setLog((log) => log
                  .concat("\n* The set of tests was successful *\n"));
              } else {
                setLog((log) => log
                    .concat("\n* The set of tests failed *\n"));
                await showAlert(errMess.current);
            }     
          });   
        } else {
            setLog((log) => log
                .concat("\n* The set of tests failed *\n"));
            await showAlert(errMess.current);
        }
      });
    } else {
      getPlatform().then((ret: { platform: string; })  =>  {
        setLog((log) => log.concat("\n* Not available for " + 
                            ret.platform + " platform *\n"));
      });          
    }
  }, [ echo, getPlatform, openStore, closeStore, isStoreOpen, isStoreExists,
    deleteStore, getItem, setItem, getAllKeys, getAllValues,
    getFilterValues, getAllKeysValues, isKey, setTable,
    removeItem, clear, isTable, getAllTables, deleteTable,
    isJsonValid, importFromJson, exportToJson, isAvailable, errMess]);   


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
        <IonCard>
          <IonCardContent>
            <pre>
              <p>{log}</p>
            </pre>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
