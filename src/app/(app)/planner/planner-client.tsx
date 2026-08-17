'use client';

import dynamic from 'next/dynamic';

const PlannerView = dynamic(() => import('@/components/planner/planner-view'), { ssr: false });

export default function PlannerClient() {
  return <PlannerView />;
}
