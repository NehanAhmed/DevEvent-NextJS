import EventCard from "@/components/EventCard"
import ExploreBtn from "@/components/ExploreBtn"
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = async () => {
  'use cache'

  cacheLife('hours');
  const base = BASE_URL ?? "http://localhost:3000";
  const result = await fetch(`${base}/api/events`, { next: { revalidate: 60 } });
  const { events } = await result.json();

  return (
    <section>
      <h1 className="text-center">The Hub for Every Dev <br /> Event You Can't Miss</h1>
      <p className="my-4 text-center">Hub conferences and many more</p>
      <ExploreBtn />

      <div className="mt-20">
        <h3>Featured Events</h3>

        <ul className="events">
          {events && events.length > 0 && events.map((event: IEvent) => (
            <li key={event.title} className="list-none">
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Page