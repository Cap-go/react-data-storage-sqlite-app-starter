import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { useStorageSQLite } from 'react-data-storage-sqlite-hook/dist';
import './Tab3.css';

const Tab3: React.FC = () => {
  const [value ,setValue] = useState("Tab 3 page");
  const {openStore, getItem} = useStorageSQLite();
  useEffect( () => {
    async function getFromStore() {
      const resOpen =  await openStore({});
      if(resOpen) {
        const mess = await getItem('message');
        const name =  await getItem('name');
        if( mess && name ) setValue(mess + name);
      }
    }
    getFromStore();
  }, [ openStore,getItem]);     
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 3</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 3</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name={value} />
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
