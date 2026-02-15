'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout, Container } from '@/components/Layout';
import CreateShipmentForm from '@/components/CreateShipmentForm';

export default function CreateShipmentPage() {
  const router = useRouter();

  return (
    <PageLayout title="Create New Shipment">
      <Container className="max-w-2xl">
        <CreateShipmentForm onClose={() => router.back()} />
      </Container>
    </PageLayout>
  );
}
