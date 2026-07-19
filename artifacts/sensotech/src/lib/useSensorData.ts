import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "./firebase";

export interface LiveSensorData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  moisture: number;
  ph: number;
  temperature: number;
  ec: number;
  

  crop: string;
  fertilizer: string;
}

export const DEFAULT_SENSOR_DATA: LiveSensorData = {
  nitrogen: 121,
  phosphorus: 326,
  potassium: 320,
  moisture: 100,
  ph: 7.0,
  temperature: 28,
    ec: 650,
  crop: "Cotton",
  fertilizer: "No Fertilizer Required",
};

export function useSensorData(): { data: LiveSensorData; loading: boolean } {
  const [data, setData] = useState<LiveSensorData>(DEFAULT_SENSOR_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sensorRef = ref(db, "sensorData");
    const unsubscribe = onValue(
      sensorRef,
      (snapshot) => {
        const val = snapshot.val();
        if (val) {
          setData((prev) => ({
            nitrogen: val.nitrogen ?? prev.nitrogen,
            phosphorus: val.phosphorus ?? prev.phosphorus,
            potassium: val.potassium ?? prev.potassium,
            moisture: val.moisture ?? prev.moisture,
            ph: val.ph ?? prev.ph,

            temperature: val.temperature ?? prev.temperature,
            ec: val.ec ?? prev.ec,

            crop: val.crop ?? prev.crop,
            fertilizer: val.fertilizer ?? prev.fertilizer,
          }));
        }
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return { data, loading };
}
