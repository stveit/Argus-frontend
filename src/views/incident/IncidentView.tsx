import React, {useEffect} from "react";
import {withRouter} from "react-router-dom";

import FilteredIncidentTable from "../../components/incidenttable/FilteredIncidentTable";
import RealtimeIncidentTable from "../../components/incidenttable/RealtimeIncidentTable";

import {IncidentFilterToolbar} from "../../components/incident/IncidentFilterToolbar";

import type {AutoUpdateMethod} from "../../api/types.d";

// Context/Hooks
import {useFilters} from "../../api/actions";
import {useAlerts} from "../../components/alertsnackbar";
import {useApiState} from "../../state/hooks";
import SelectedFilterProvider from "../../components/filterprovider"; // TODO: move
import IncidentsProvider from "../../components/incidentsprovider"; // TODO: move
import {Helmet} from "react-helmet";
import {FRONTEND_VERSION, SERVER_METADATA} from "../../config";

const IncidentComponent = ({ autoUpdateMethod }: { autoUpdateMethod: AutoUpdateMethod }) => {
  return autoUpdateMethod === "realtime" ? (
    <RealtimeIncidentTable key="realtime" />
  ) : (
    <FilteredIncidentTable key="interval" />
  );
};

type IncidentViewPropsType = {};

const IncidentView: React.FC<IncidentViewPropsType> = () => {
  const [{ autoUpdateMethod }] = useApiState();
  const [, { loadAllFilters }] = useFilters();
  const displayAlert = useAlerts();

  let apiVersion: string = "";
  let backendVersion: string = "";

  const getServerMetadata = async () => {
    return await SERVER_METADATA()
        .then(data => {
          return data
        })
        .then(data => {
          apiVersion = data["api-version"].stable ?
              `${data["api-version"].stable} (stable)` :
              `${data["api-version"].unstable} (unstable)`;
          backendVersion = data["backend-version"];
        })
        .catch(error => console.log(error));
  }


  useEffect(() => {
    getServerMetadata();
    loadAllFilters()
      // .then(() => displayAlert("Loaded filters", "success"))
      .catch((error) => displayAlert(`Failed to fetch filters: ${error}`, "error"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Helmet>
        <title>Argus | Incidents</title>
      </Helmet>
      <SelectedFilterProvider>
        <IncidentsProvider>
          <IncidentFilterToolbar />
          <IncidentComponent autoUpdateMethod={autoUpdateMethod} />
        </IncidentsProvider>
      </SelectedFilterProvider>
      <p>
        Backend {backendVersion},
        API {apiVersion},
        frontend v.{FRONTEND_VERSION}
      </p>
    </div>
  );
};

export default withRouter(IncidentView);
