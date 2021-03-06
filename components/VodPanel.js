import TwitchApi from "../lib/TwitchApi";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Link, Text, Box } from "@chakra-ui/react";
import moment from "moment";

const imageHeight = 720;
const imageWidth = 1280;

const millisInDay = 86400000;

export default function VodPanel(props) {
  const [vod, setVod] = useState({});

  useEffect(async () => {
    if (!vod.title) {
      const vods = await TwitchApi.getVodsForChannel(
        props.channel,
        props.token.access_token,
        props.clientId
      );
      const latestVod = vods.data[0];
      console.log(latestVod);
      if (
        latestVod &&
        Date.now() - Date.parse(latestVod.created_at) < millisInDay &&
        latestVod.thumbnail_url
      ) {
        latestVod.thumbnail_url = latestVod.thumbnail_url
          .replace("%{height}", imageHeight)
          .replace("%{width}", imageWidth);
        setVod(latestVod);
        console.log(latestVod);
      }
    }
  });

  if (!vod.title) {
    return null;
  }
  return (
    <Link href={vod.url} isExternal>
      <Box
        maxW="xl"
        cursor="pointer"
        borderWidth="md"
        borderRadius="lg"
        overflow="hidden"
      >
        <Image
          src={vod.thumbnail_url}
          height={imageHeight}
          width={imageWidth}
        />
        <Text>
          <b>{vod.user_name}</b> - {vod.title}
        </Text>
        <Text>
          {moment(vod.created_at).fromNow()} - {vod.duration}
        </Text>
      </Box>
    </Link>
  );
}
