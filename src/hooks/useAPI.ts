import * as landApi from '@/features/api/land.api';
import * as boxApi from '@/features/api/box.api';
import * as referApi from '@/features/api/refer.api';
import * as userApi from '@/features/api/user.api';
import * as alchemyApi from '@/features/api/alchemy.api';
import * as moralisApi from '@/features/api/moralis.api';
import * as proposalApi from '@/features/api/proposal.api';


export default function useAPI() {
  return {
    land: {
      ...landApi,
    },
    box: {
      ...boxApi,
    },
    refer: {
      ...referApi,
    },
    user: {
      ...userApi,
    },
    proposal: {
      ...proposalApi,
    },
    alchemy: {
      ...alchemyApi,
    },
    moralis: {
      ...moralisApi,
    }
  };
}
