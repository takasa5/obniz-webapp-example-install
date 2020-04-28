import { runInThisContext } from "vm";
import InstallRequest from "./install";
import Queues from "./queues";

const api_obniz_io = `https://api.obniz.io`;
const WebAppToken: string = process.env.TOKEN!;

const dummyInstalls = [
  {
    id: "ins1",
    configs: {},
    createdAt: "",
    updatedAt: "",
    user: {},
    devicesInConfig: {},
  },
  {
    id: "ins2",
    configs: {},
    createdAt: "",
    updatedAt: "",
    user: {},
    devicesInConfig: {},
  },
  {
    id: "ins3",
    configs: {},
    createdAt: "",
    updatedAt: "",
    user: {},
    devicesInConfig: {},
  },
  {
    id: "ins4",
    configs: {},
    createdAt: "",
    updatedAt: "",
    user: {},
    devicesInConfig: {},
  },
  {
    id: "ins5",
    configs: {},
    createdAt: "",
    updatedAt: "",
    user: {},
    devicesInConfig: {},
  },
];
export default class AppManager {
  private installQueue = Queues.installQueue;
  private taskQueue = Queues.taskQueue;

  constructor() {}

  public async start_master() {
    let installs: any[] = [];
    // Getting All Installs
    while (true) {
      const result = await InstallRequest(api_obniz_io, WebAppToken, installs.length);
      console.log(result);
      for (const edge of result.webapp.installs.edges) {
        const node = edge.node;
        installs.push(node);
      }
      if (!result.webapp.installs.pageInfo.hasNextPage) {
        break;
      }
    }
    installs = dummyInstalls;
    console.log(`Install app number=${installs.length}`);

    for (const install of installs) {
      this.installQueue.add("install", install);
    }
  }

  public async webhooked(obj: any) {
    const install = obj.data;
    if (obj.type === "install.create") {
      this.installQueue.add("install", install, { attempts: 10 });
    } else if (obj.type === "install.update") {
      this.taskQueue.add("update", install, { attempts: 10 });
    } else if (obj.type === "install.delete") {
      this.taskQueue.add("delete", install, { attempts: 10 });
    }
  }
}
