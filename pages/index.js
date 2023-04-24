import { Fragment } from "react";
import Head from "next/head";
import { MongoClient } from "mongodb";

import MeetupList from "@/components/meetups/MeetupList";

// image:
//       "https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg",

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React meetups</title>
        <meta
          name="description"
          content="Browse a huge listof highly active React meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />;
    </Fragment>
  );
}

// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

export async function getStaticProps() {
  // fetch data from an api
  const client = await MongoClient.connect(
    "mongodb+srv://First-User:tpePPaeAWAYEC0kb@cluster0.4drvdpp.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollections = db.collection("meetups");

  const meetups = await meetupsCollections.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  };
}

export default HomePage;
