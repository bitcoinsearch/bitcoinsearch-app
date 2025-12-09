import { Banner } from "@bitcoin-dev-project/bdp-ui";

const BossBanner = () => {
  return (
    <div className={`w-full bg-bdp-background sticky top-0`}>
      <Banner
        headingText="Start your career in bitcoin open source —"
        linkText="APPLY TO THE ₿OSS CHALLENGE TODAY"
        linkTo="https://bosschallenge.xyz/"
        hasBoss
        styles={{
          container: "data-[has-heading='true']:h-auto",
          bannerInfoContainer: "py-2",
        }}
      />
    </div>
  );
};

export default BossBanner;
