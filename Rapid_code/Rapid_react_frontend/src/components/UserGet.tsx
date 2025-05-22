// src/api/UserGet.tsx (or src/components/UserGet.tsx)
import { useEffect } from "react";
import React from "react";

import api from "../api/globalApi";

function UserGet() {
  useEffect(() => {
    api
      .get("/hello")
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  }, []);

  return <div></div>;
}

export default UserGet;
