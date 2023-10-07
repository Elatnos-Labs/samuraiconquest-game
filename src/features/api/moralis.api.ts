import Moralis from 'moralis';
import Config from '@/app/config';


const getNFTsOfOwner = async (owner: any, tokenAddress: any) => {
    try {
        const response = await Moralis.EvmApi.nft.getWalletNFTs({
            "chain": "0x61",
            "format": "decimal",
            "tokenAddresses": [
                tokenAddress
            ],
            "mediaItems": false,
            "address": `${owner}`
        });
        return response.raw

    } catch (e) {
        console.error(e);
    }
}

const getSamuraiWarriorMetadata = async (id: Number) => {
    try {
        const response = await Moralis.EvmApi.nft.getNFTMetadata({
            "chain": "0x61",
            "format": "decimal",
            "normalizeMetadata": false,
            "mediaItems": false,
            "address": `${Config.SAMURAI_WARRIORS_ADDRESS}`,
            "tokenId": `${id}`
        });
        console.log(response.raw);
        return response.raw

    } catch (e) {
        console.error(e);
    }
}
const getSamuraiWarriorMetadataResync = async (id: Number) => {
    try {
        const response = await Moralis.EvmApi.nft.reSyncMetadata({
            "chain": "0x61",
            "flag": "uri",
            "mode": "async",
            "address": `${Config.SAMURAI_WARRIORS_ADDRESS}`,
            "tokenId": `${id}`
        });


        console.log(response.raw);
        return response.raw

    } catch (e) {
        console.error(e);
    }
}





export { getSamuraiWarriorMetadata, getNFTsOfOwner, getSamuraiWarriorMetadataResync };
