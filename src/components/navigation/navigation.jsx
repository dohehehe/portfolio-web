"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getLocaleFromPathname,
  isDetailRoute,
  localizedPath,
  stripLocaleFromPathname,
} from "@/lib/locale/routing";
import { useNavigationScrollHide } from "@/hooks/useNavigationScrollHide";
import EventList from "@/components/event/EventList";
import WorkList from "./workList";
import InstallationNavLabel from "./InstallationNavLabel";
import styles from "./navigation.module.css";
import LanguageSwitch from "../locale/LanguageSwitch";

function isWorkListRoute(pathname) {
  const path = stripLocaleFromPathname(pathname);
  return path === "/" || path === "/work";
}

function isWorkRoute(pathname) {
  const path = stripLocaleFromPathname(pathname);
  return path === "/work" || path.startsWith("/work/");
}

function isEventListRoute(pathname) {
  const path = stripLocaleFromPathname(pathname);
  return path === "/event";
}

function isEventRoute(pathname) {
  const path = stripLocaleFromPathname(pathname);
  return path === "/event" || path.startsWith("/event/");
}

function isTextRoute(pathname) {
  const path = stripLocaleFromPathname(pathname);
  return path === "/text" || path.startsWith("/text/");
}

function isInfoRoute(pathname) {
  const path = stripLocaleFromPathname(pathname);
  return path === "/info";
}

export default function Navigation({
  initialProjects = [],
  initialWorks = [],
  initialEvents = [],
}) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const workListActive = isWorkListRoute(pathname);
  const eventListActive = isEventListRoute(pathname);
  const workActive = isWorkRoute(pathname);
  const eventActive = isEventRoute(pathname);
  const textActive = isTextRoute(pathname);
  const infoActive = isInfoRoute(pathname);
  const detailRoute = isDetailRoute(pathname);
  const { isHidden, show } = useNavigationScrollHide(detailRoute);

  return (
    <header className={styles.header}>
      <nav
        className={`${styles.navigation} ${detailRoute && isHidden ? styles.navigationHidden : ""}`.trim()}
        onTouchStart={detailRoute ? show : undefined}
      >
        <div
          className={`${styles.navigationSection} ${workListActive ? styles.workListVisible : ""}`}
        >
          <Link
            className={`${styles.navigationLink} ${workActive ? styles.navigationLinkActive : ""}`.trim()}
            href={localizedPath("/work", locale)}
          >
            work
          </Link>
          <WorkList
            className={styles.workList}
            initialProjects={initialProjects}
            initialWorks={initialWorks}
          />
        </div>

        <div
          className={`${styles.navigationSection} ${eventListActive ? styles.eventListVisible : ""}`}
        >
          <Link
            className={`${styles.navigationLink} ${eventActive ? styles.navigationLinkActive : ""}`.trim()}
            href={localizedPath("/event", locale)}
            aria-label="installation"
          >
            <InstallationNavLabel />
          </Link>
          <EventList
            className={styles.eventList}
            events={initialEvents}
          />
        </div>
        <Link
          className={`${styles.navigationLink} ${textActive ? styles.navigationLinkActive : ""}`.trim()}
          href={localizedPath("/text", locale)}
        >
          text
        </Link>
        <a className={styles.navigationLink} href={"https://log.doheekwak.com"} target="_blank">
          log
        </a>
        <Link
          className={`${styles.navigationLink} ${infoActive ? styles.navigationLinkActive : ""}`.trim()}
          href={localizedPath("/info", locale)}
        >
          dohee kwak
        </Link>
        <LanguageSwitch />
      </nav>
    </header>
  );
}
