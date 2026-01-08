import { useEffect } from "react";
import HandleStateBlock from "../components/state-block";
import HandleUserCard from "../components/user-card";
import { EMPTY_LIST_LENGTH, UNKNOWN_ERROR_MESSAGE } from "../lib/constants";
import { useUsers } from "../hooks/use-users";
import { AsyncStatus } from "../store/async-status";
import { useAppDispatch } from "../store/hooks";
import {
  loadWeatherSnapshots,
  type WeatherRequest
} from "../store/weather-slice";

export default function HandleUserListPage() {
  const dispatch = useAppDispatch();
  const { items, status, error, onReload } = useUsers();
  const hasUsers = items.length > EMPTY_LIST_LENGTH;
  const isLoading =
    status === AsyncStatus.IDLE || status === AsyncStatus.LOADING;
  useEffect(() => {
    if (hasUsers) {
      const requests: WeatherRequest[] = [];

      for (const user of items) {
        requests.push({
          userId: user.id,
          latitude: user.latitude,
          longitude: user.longitude
        });
      }

      dispatch(loadWeatherSnapshots(requests));
    }
  }, [dispatch, hasUsers, items]);

  if (isLoading) {
    return <HandleStateBlock>Loading users...</HandleStateBlock>;
  }

  if (status === AsyncStatus.FAILED) {
    return (
      <HandleStateBlock tone="error">
        <p>Failed to load users: {error ?? UNKNOWN_ERROR_MESSAGE}</p>
        <button className="button primary" onClick={onReload}>
          Retry
        </button>
      </HandleStateBlock>
    );
  }

  if (!hasUsers) {
    return <HandleStateBlock>No users found.</HandleStateBlock>;
  }

  const userCards: JSX.Element[] = [];
  for (const user of items) {
    userCards.push(<HandleUserCard key={user.id} user={user} />);
  }

  return (
    <section className="user-list">
      <div className="user-grid">
        {userCards}
      </div>
    </section>
  );
}
