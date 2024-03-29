"use server";

async function getCollectionsStats(collectionIds: string[]) {
  try {
    let apikey: string = process.env.SIMPLE_HASH ?? "";

    const headers = new Headers();
    headers.append("x-api-key", apikey);

    let allCollectionStats: any = [];
    // console.log("Inside getCollectionsStats");

    for (let i = 0; i < collectionIds.length; i += 5) {
      const currentCollectionIds = collectionIds.slice(i, i + 5);
      const currentCollectionIdsParam = currentCollectionIds.join(",");

      // console.log("currentCollectionIdsParam", currentCollectionIdsParam);

      const response = await fetch(
        `https://api.simplehash.com/api/v0/nfts/collections_activity?collection_ids=${currentCollectionIdsParam}`,
        {
          method: "GET",
          headers: headers,
        }
      );

      // console.log("response", response);

      if (!response.ok) {
        throw new Error(`Failed to fetch data from API. Status: ${response.status}`);
      }

      const jsonData = await response.json();

      const collectionStats = jsonData.collections.map((collection: any) => ({
        collection_id: collection.collection_id,
        name: collection.name,
        volume_1d: collection["1_day_volume"],
        volume_7d: collection["7_day_volume"],
        volume_30d: collection["30_day_volume"],
        market_cap: collection.market_cap,
      }));

      allCollectionStats = [...allCollectionStats, ...collectionStats];
    }

    if (allCollectionStats.length === 0) {
      throw new Error("No collection stats found");
    }
    // console.log("allCollectionStats", allCollectionStats);

    return allCollectionStats;
  } catch (error) {
    console.error("Error fetching collection stats:", error);
    throw new Error("Error fetching collection stats");
    return [];
  }
}

export default getCollectionsStats;
