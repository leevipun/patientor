import {useEffect, useState} from 'react';
import {getDiagnosis, getPatient} from './../../services/patients';
import {Diagnosis, Patient} from '../../types';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';

const PatientInspectPage = () => {
  const [patient, setPatient] = useState<Patient | undefined>();
  const [genderIcon, setGenderIcon] = useState<JSX.Element | undefined>();
  const [diagnosis, SetDiagnosis] = useState<Diagnosis[]>([]);
  useEffect(() => {
    const fetchPatientList = async () => {
      const patient = await getPatient(window.location.pathname.split('/')[2]);
      console.log(patient.entries);
      setPatient(patient);
      const diagnosis = await getDiagnosis();
      console.log(diagnosis);
      const mappedDiagnoses = patient.entries.map((entry) => {
        return entry.diagnosisCodes?.map((code) => {
          return diagnosis.find(
            (diagnosis: Diagnosis) => diagnosis.code === code
          );
        });
      });
      SetDiagnosis(mappedDiagnoses.flat());
      if (patient.gender === 'male') {
        setGenderIcon(<MaleIcon />);
      } else if (patient.gender === 'female') {
        setGenderIcon(<FemaleIcon />);
      } else {
        setGenderIcon(<></>);
      }
    };
    void fetchPatientList();
  }, []);

  return (
    <div>
      <h1>Patient Inspect Page</h1>
      {patient && (
        <div>
          <h2>
            {patient.name} {genderIcon}
          </h2>
          <p>ssn: {patient.ssn}</p>
          <p>occupation: {patient.occupation}</p>
          <h3>entries</h3>
          <p>
            {patient.entries.map((entry) => (
              <div key={entry.id}>
                <p>
                  {entry.date} {entry.description}
                </p>
                <ul>
                  {entry.diagnosisCodes?.map((code) => (
                    <li key={code}>
                      {code}
                      {
                        diagnosis.find(
                          (diagnosis: Diagnosis) => diagnosis.code === code
                        )?.name
                      }
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </p>
        </div>
      )}
    </div>
  );
};

export default PatientInspectPage;
