import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
export async function getAxiosClient() {
  const userDetails = await AsyncStorage.getItem("userDetails");
  let axiosInstance = axios.create({ timeout: 40000 });
  axiosInstance.interceptors.request.use(function (config) {
    if (userDetails && JSON.parse(userDetails).accessToken) {
      var token = "Bearer " + JSON.parse(userDetails).accessToken;
      axiosInstance.defaults.headers.common.authorization = token;
      config.headers.authorization = token;
    } else {
      console.log("NO TOKEN IS FOUND.. IT SHOULD NOT HAPPEN USUALLY");
    }
    return config;
  }, function (error) {
    return promise.reject(error);
  });

  axiosInstance.interceptors.response.use(
    null,
    async (error) => {
      console.log(error, "&&&&&&&&&&&&", error.message, error.response)
      return Promise.resolve(error.response ? error.response : error.message ? error.message : error);
    }
  );
  return axiosInstance;
}



