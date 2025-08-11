export function extractContinuationToken(response: any): string | undefined {
  try {
    const continuationItems = response.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents||
     response.onResponseReceivedCommands?.[0]?.appendContinuationItemsAction?.continuationItems
     console.log("from extractor," ,continuationItems);
     

    for (const section of continuationItems) {
      const continuation = section.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token;
      if (continuation) return continuation;
    }
  } catch (e) {}

  return undefined;
}