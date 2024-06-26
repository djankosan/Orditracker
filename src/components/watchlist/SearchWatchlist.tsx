"use client";

import * as React from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { Container } from "@mui/material";
import { getWatchlists, addWatchListBySlug } from "@/actions/handleWatchlist";
import { useCurrentUser } from "@/hooks/current-user";
import { useRouter } from "next/navigation";
import { cleanData, sortingTable } from "../dashboard/Table";
import { helperToast } from "@/lib/helperToast";

function SearchWatchlist({
  watchlist,
  setWatchlist,
  sort,
  setSort,
  isLoading,
  setIsLoading,
  sortDirections,
  setSortDirections,
}: {
  watchlist: any;
  setWatchlist: React.Dispatch<React.SetStateAction<any>>;
  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  sortDirections: any;
  setSortDirections: React.Dispatch<React.SetStateAction<any>>;
}) {
  const user: any = useCurrentUser();
  const router = useRouter();
  let userRef: any = React.useRef(user);
  if (!userRef) {
    helperToast.error("Please login to add a collection to your watchlist");
    router.push("/auth/signin");
  }
  console.log("userRef", userRef, user);

  const handleaddWatchListBySlug = async (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      setIsLoading(true);
      const slug = event.target as HTMLInputElement;
      //add watchlist server action
      // console.log(
      //   "data before fetch:: \n",
      //   JSON.parse(localStorage.getItem("watchlistTableData") as string)
      // );
      const data: any = await addWatchListBySlug(slug.value, userRef);

      if (data.error) {
        if (
          data.error === "Please login to add a collection to your watchlist"
        ) {
          helperToast.error(data.error);
          router.push("/auth/signin");
        } else {
          helperToast.error(data.error);
          slug.value = "";
          return;
        }
      }
      //if watchlist added successfully -> force a rerender of the watchlist page
      // console.log("latest watchlist table data", data);
      const currentWatchlistTableData: any = JSON.parse(
        localStorage.getItem("watchlistTableData") as string
      );

      // console.log("currentWatchlistTableData", currentWatchlistTableData);

      const appendedData = [...currentWatchlistTableData, data];

      let sortedData = sortingTable(
        sort,
        appendedData,
        sortDirections[sort as keyof typeof sortDirections]
      );

      // console.log("sortedData", sortedData);

      sortedData = cleanData(sortedData);

      // console.log("cleaned data", sortedData);

      setWatchlist(sortedData);
      localStorage.setItem("watchlistTableData", JSON.stringify(sortedData));
      setIsLoading(false);

      slug.value = "";

      return;
    }
  };

  return (
    <Paper
      sx={{
        display: "flex",
        flexWrap: "wrap",
        listStyle: "none",
        p: 0,
        m: 0,
        // backgroundColor: "#000000",
      }}
      component="ul"
    >
      <Container
        sx={{
          display: "flex",
          backgroundColor: "#000000",
          padding: "10px",
          margin: "0px",
          minWidth: "100%",
          height: "100%",
          // boxShadow: "0px 0px 2px 0px #c5c2f1",
        }}
        disableGutters
      >
        <TextField
          id="filled-basic"
          variant="outlined"
          onKeyDown={handleaddWatchListBySlug}
          style={{
            borderRadius: "50px",
            margin: "0px",
            paddingLeft: "0px",
            color: "#000000",
          }}
          label="Enter Collection Slug Or MagicEden Url"
          sx={{
            width: "50%",
            "&placeholder": {
              marginLeft: "10px",
              textAlign: "center",
              fontSize: "1.5rem",
            },
            "&focused": {
              backgroundColor: "#000000",
            },
          }}
        />
      </Container>
    </Paper>
  );
}

export default SearchWatchlist;
