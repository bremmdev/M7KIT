export type BreadCrumbProps = React.ComponentPropsWithRef<"nav"> & {
  breadcrumbs: Array<BreadCrumbType>;
};

export type BreadCrumbType = {
  text: string;
  href: string;
};
