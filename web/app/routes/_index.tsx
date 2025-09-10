import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import React from "react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  InlineStack,
  Badge,
  ProgressBar,
  Banner,
  EmptyState,
  Spinner,
} from "@shopify/polaris";
import { useState, useEffect, useCallback } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);

  const shopDomain = session.shop;

  // Get index status from our backend
  let indexStatus = null;
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/admin/index/status/${shopDomain}`);
    if (response.ok) {
      indexStatus = await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch index status:", error);
  }

  return json({
    shopDomain,
    indexStatus,
    backendUrl: process.env.BACKEND_URL || "http://localhost:8000",
  });
};

export const action = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const action = formData.get("action");

  if (action === "start_indexing") {
    try {
      const indexFormData = new FormData();
      indexFormData.append("shop_domain", session.shop);

      const response = await fetch(`${process.env.BACKEND_URL}/admin/index`, {
        method: "POST",
        body: indexFormData,
      });

      if (response.ok) {
        const result = await response.json();
        return json({ success: true, jobId: result.job_id });
      } else {
        return json({ success: false, error: "Failed to start indexing" });
      }
    } catch (error) {
      return json({ success: false, error: error.message });
    }
  }

  return json({ success: false, error: "Unknown action" });
};

export default function Index() {
  const { shopDomain, indexStatus: initialStatus, backendUrl } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const [indexStatus, setIndexStatus] = useState(initialStatus);
  const [isPolling, setIsPolling] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/admin/index/status/${shopDomain}`);
      if (response.ok) {
        const data = await response.json();
        setIndexStatus(data);
        return data;
      }
    } catch (error) {
      console.error("Failed to fetch status:", error);
    }
    return null;
  }, [backendUrl, shopDomain]);

  const startIndexing = () => {
    const formData = new FormData();
    formData.append("action", "start_indexing");
    submit(formData, { method: "post" });
    setIsPolling(true);
  };

  // Poll for status updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPolling || (indexStatus?.status === "running" || indexStatus?.status === "queued")) {
      interval = setInterval(async () => {
        const status = await fetchStatus();
        if (status && (status.status === "done" || status.status === "error")) {
          setIsPolling(false);
        }
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPolling, indexStatus?.status, fetchStatus]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { tone: any; children: string }> = {
      queued: { tone: "info", children: "Queued" },
      running: { tone: "attention", children: "Running" },
      done: { tone: "success", children: "Completed" },
      error: { tone: "critical", children: "Error" },
      no_jobs: { tone: "subdued", children: "Not Started" },
    };
    const config = statusMap[status] || statusMap.no_jobs;
    return <Badge tone={config.tone}>{config.children}</Badge>;
  };

  const getProgressPercentage = () => {
    if (!indexStatus || indexStatus.total === 0) return 0;
    return Math.round((indexStatus.processed / indexStatus.total) * 100);
  };

  return (
    <Page title="Snap2Shop" subtitle="Manage your visual search functionality">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between">
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h2">
                    Product Indexing
                  </Text>
                  <Text variant="bodyMd" tone="subdued">
                    Index your products for visual search
                  </Text>
                </BlockStack>
                {getStatusBadge(indexStatus?.status || "no_jobs")}
              </InlineStack>

              {indexStatus && indexStatus.status !== "no_jobs" && (
                <BlockStack gap="200">
                  {indexStatus.status === "running" && (
                    <>
                      <ProgressBar progress={getProgressPercentage()} size="medium" />
                      <Text variant="bodyMd">
                        Processing {indexStatus.processed} of {indexStatus.total} products
                      </Text>
                    </>
                  )}

                  {indexStatus.product_count > 0 && (
                    <Text variant="bodyMd">
                      <Text variant="bodyMd" fontWeight="bold" as="span">
                        {indexStatus.product_count}
                      </Text>{" "}
                      products indexed
                    </Text>
                  )}

                  {indexStatus.started_at && (
                    <Text variant="bodySm" tone="subdued">
                      Started: {new Date(indexStatus.started_at).toLocaleString()}
                    </Text>
                  )}

                  {indexStatus.finished_at && (
                    <Text variant="bodySm" tone="subdued">
                      Finished: {new Date(indexStatus.finished_at).toLocaleString()}
                    </Text>
                  )}

                  {indexStatus.error && (
                    <Banner tone="critical">
                      <Text variant="bodyMd">{indexStatus.error}</Text>
                    </Banner>
                  )}
                </BlockStack>
              )}

              {(!indexStatus ||
                indexStatus.status === "no_jobs" ||
                indexStatus.status === "done") && (
                <EmptyState
                  heading={indexStatus?.product_count > 0 ? "Indexing Complete" : "Get Started"}
                  action={{
                    content:
                      indexStatus?.product_count > 0 ? "Re-index Products" : "Index Products",
                    onAction: startIndexing,
                  }}
                  image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
                >
                  <Text variant="bodyMd">
                    {indexStatus?.product_count > 0
                      ? "Your products are indexed and ready for visual search."
                      : "Index your product catalog to enable visual search functionality."}
                  </Text>
                </EmptyState>
              )}

              {(isPolling || indexStatus?.status === "running" || indexStatus?.status === "queued") && (
                <InlineStack align="center" gap="200">
                  <Spinner size="small" />
                  <Text variant="bodyMd">Indexing in progress...</Text>
                </InlineStack>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section variant="oneThird">
          <BlockStack gap="400">
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h3">
                  Quick Stats
                </Text>
                <BlockStack gap="200">
                  <InlineStack align="space-between">
                    <Text variant="bodyMd">Products Indexed</Text>
                    <Text variant="bodyMd" fontWeight="bold">
                      {indexStatus?.product_count || 0}
                    </Text>
                  </InlineStack>
                  <InlineStack align="space-between">
                    <Text variant="bodyMd">Status</Text>
                    {getStatusBadge(indexStatus?.status || "no_jobs")}
                  </InlineStack>
                </BlockStack>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h3">
                  Phase 0 Features
                </Text>
                <BlockStack gap="200">
                  <Text variant="bodyMd">✅ Manual product indexing</Text>
                  <Text variant="bodyMd">✅ Visual similarity search</Text>
                  <Text variant="bodyMd">✅ Theme app embed widget</Text>
                  <Text variant="bodyMd">⏳ Auto-sync (Phase 1)</Text>
                  <Text variant="bodyMd">⏳ Advanced analytics (Phase 1)</Text>
                </BlockStack>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}