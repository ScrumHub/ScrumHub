/**
 * @jest-environment jsdom
 */
import expect from "expect"; // You can use any testing library
import config from "../configuration/config";
import * as Fetching from "../appstate/fetching";
import { errorObject, initAddPBI, initSprint } from "../appstate/stateInitValues";
import { testConnectionError, testFilters } from "../appstate/stateTestValues";
const axios = require('axios');

/* At the same scope with `require`*/
jest.mock('axios');
describe("getResponse", () => {
  describe("when the token is wrong and API call is unsuccessful", () => {
    it("should return Connection Error", async () => {
      axios.get.mockResolvedValueOnce(testConnectionError);
      const result = await Fetching.getResponse(axios.get(`https://api.github.com/rate_limit`, 
      { headers: { "Accept": "application/vnd.github.v3+json"}}));
      expect(axios.get).toHaveBeenCalledWith(`https://api.github.com/rate_limit`, 
      { headers: { "Accept": "application/vnd.github.v3+json"}});
      expect(result).toEqual(testConnectionError);
    });
  });
});
  
describe("addRepo", () => {
  describe("when the token is wrong and API call is unsuccessful", () => {
    it("should return Connection Error", async () => {
      axios.post.mockResolvedValueOnce(testConnectionError);
      const result = await Fetching.addRepo(0, config.token);
      expect(result).toEqual(errorObject);
    });
  });
});

describe("fetchRepos", () => {
  describe("when the token is wrong and API call is unsuccessful", () => {
    it("should return Connection Error", async () => {
      axios.get.mockResolvedValueOnce(testConnectionError);
      const result = await Fetching.fetchRepos(testFilters,config.token);
      expect(result).toEqual(errorObject);
    });
  });
});

describe("fetchPBIs", () => {
  describe("when the token is wrong and API call is unsuccessful", () => {
    it("should return Connection Error", async () => {
      axios.get.mockResolvedValueOnce(testConnectionError);
      const result = await Fetching.fetchPBIs("", config.token,testFilters,);
      expect(result).toEqual(errorObject);
    });
  });
});

describe("addPBI", () => {
  describe("when the token is wrong and API call is unsuccessful", () => {
    it("should return Connection Error", async () => {
      axios.post.mockResolvedValueOnce(testConnectionError);
      const result = await Fetching.addPBI("", config.token,initAddPBI,);
      expect(result).toEqual(errorObject);
    });
  });
});

describe("finishPBI", () => {
  describe("when the token is wrong and API call is unsuccessful", () => {
    it("should return Connection Error", async () => {
      axios.patch.mockResolvedValueOnce(testConnectionError);
      const result = await Fetching.finishPBI("", config.token,0);
      expect(result).toEqual(errorObject);
    });
  });
});


describe("estimatePBI", () => {
  describe("when the token is wrong and API call is unsuccessful", () => {
    it("should return Connection Error", async () => {
      axios.patch.mockResolvedValueOnce(testConnectionError);
      const result = await Fetching.estimatePBI("", config.token,0,0);
      expect(result).toEqual(errorObject);
    });
  });
});

describe("deletePBI", () => {
  describe("when the token is wrong and API call is unsuccessful", () => {
    it("should return Connection Error", async () => {
      axios.delete.mockResolvedValueOnce(testConnectionError);
      const result = await Fetching.deletePBI("", config.token,0);
      expect(result).toEqual(errorObject);
    });
  });
});

describe("fetchSprints", () => {
  describe("when the token is wrong and API call is unsuccessful", () => {
    it("should return Connection Error", async () => {
      axios.get.mockResolvedValueOnce(testConnectionError);
      const result = await Fetching.fetchSprints("", config.token,{});
      expect(result).toEqual(errorObject);
    });
  });
});

describe("fetchOneSprint", () => {
  describe("when the token is wrong and API call is unsuccessful", () => {
    it("should return Connection Error", async () => {
      axios.get.mockResolvedValueOnce(testConnectionError);
      const result = await Fetching.fetchOneSprint("", config.token,0);
      expect(result).toEqual(errorObject);
    });
  });
});

describe("getCurrentUser", () => {
  describe("when the token is wrong and API call is unsuccessful", () => {
    it("should return Connection Error", async () => {
      axios.get.mockResolvedValueOnce(testConnectionError);
      const result = await Fetching.getCurrentUser(config.token);
      expect(result).toEqual(errorObject);
    });
  });
});

describe("updateOneSprint", () => {
  describe("when the token is wrong and API call is unsuccessful", () => {
    it("should return Connection Error", async () => {
      axios.put.mockResolvedValueOnce(testConnectionError);
      const result = await Fetching.updateOneSprint(config.token,"", 0,initSprint);
      expect(result).toEqual(errorObject);
    });
  });
});

describe("completeOneSprint", () => {
  describe("when the token is wrong and API call is unsuccessful", () => {
    it("should return Connection Error", async () => {
      axios.put.mockResolvedValueOnce(testConnectionError);
      const result = await Fetching.completeOneSprint(config.token, "", 0,true);
      expect(result).toEqual(errorObject);
    });
  });
});